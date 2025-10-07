import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

// Tier mapping
const TIER_MAP: Record<string, 'free' | 'pro' | 'partner'> = {
  'prod_TC5jlebGbWYcBN': 'pro',
  'prod_TC5jETrgpY2aBY': 'partner',
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("No Stripe signature found");
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    let event: Stripe.Event;
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }

    logStep("Received event", { type: event.type });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Checkout completed", { sessionId: session.id });

        const customerEmail = session.customer_email || session.customer_details?.email;
        if (!customerEmail) {
          logStep("No email found in session");
          break;
        }

        // Get user by email
        const { data: users } = await supabaseAdmin.auth.admin.listUsers();
        const user = users?.users.find(u => u.email === customerEmail);
        
        if (!user) {
          logStep("User not found", { email: customerEmail });
          break;
        }

        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const productId = subscription.items.data[0].price.product as string;
        const tier = TIER_MAP[productId] || 'free';

        logStep("Creating subscription record", { userId: user.id, tier });

        // Upsert subscription
        await supabaseAdmin.from("subscriptions").upsert({
          user_id: user.id,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscription.id,
          tier: tier,
          status: "active",
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: false,
        });

        // Assign role - delete old roles first to prevent privilege escalation
        await supabaseAdmin.from("user_roles")
          .delete()
          .eq("user_id", user.id)
          .neq("role", "free");
        
        await supabaseAdmin.from("user_roles").insert({
          user_id: user.id,
          role: tier,
        });

        // Check for referral
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("referral_code")
          .eq("user_id", user.id)
          .single();

        if (session.client_reference_id) {
          // Link referral
          const { data: referrer } = await supabaseAdmin
            .from("profiles")
            .select("user_id")
            .eq("referral_code", session.client_reference_id)
            .single();

          if (referrer) {
            logStep("Linking referral", { referrerId: referrer.user_id, referredId: user.id });
            
            await supabaseAdmin.from("referrals").upsert({
              referrer_id: referrer.user_id,
              referred_id: user.id,
              subscription_id: subscription.id,
              status: "active",
            });

            // Calculate initial commission (40% of first payment)
            const amount = subscription.items.data[0].price.unit_amount! / 100;
            const commission = amount * 0.4;
            
            await supabaseAdmin.rpc("add_affiliate_earnings", {
              _referrer_id: referrer.user_id,
              _amount: commission,
            });

            await supabaseAdmin.rpc("update_affiliate_stats", {
              user_id_param: referrer.user_id,
            });

            logStep("Added commission", { referrerId: referrer.user_id, commission });
          }
        }

        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        
        if (invoice.billing_reason !== "subscription_cycle") {
          break; // Skip first invoice (already handled in checkout)
        }

        logStep("Recurring payment succeeded", { invoiceId: invoice.id });

        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
        
        // Find referral by subscription_id
        const { data: referral } = await supabaseAdmin
          .from("referrals")
          .select("referrer_id")
          .eq("subscription_id", subscription.id)
          .eq("status", "active")
          .single();

        if (referral) {
          const amount = invoice.amount_paid / 100;
          const commission = amount * 0.4;

          logStep("Adding recurring commission", { referrerId: referral.referrer_id, commission });

          await supabaseAdmin.rpc("add_affiliate_earnings", {
            _referrer_id: referral.referrer_id,
            _amount: commission,
          });

          await supabaseAdmin.rpc("update_affiliate_stats", {
            user_id_param: referral.referrer_id,
          });
        }

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Subscription updated", { subscriptionId: subscription.id });

        const { data: existingSub } = await supabaseAdmin
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", subscription.id)
          .single();

        if (existingSub) {
          const productId = subscription.items.data[0].price.product as string;
          const tier = TIER_MAP[productId] || 'free';

          await supabaseAdmin.from("subscriptions").update({
            tier: tier,
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          }).eq("stripe_subscription_id", subscription.id);

          // Update role - properly handle tier changes to prevent privilege escalation
          if (subscription.status === "active") {
            // Delete all paid roles first
            await supabaseAdmin.from("user_roles")
              .delete()
              .eq("user_id", existingSub.user_id)
              .neq("role", "free");
            
            // Add new tier role
            await supabaseAdmin.from("user_roles").insert({
              user_id: existingSub.user_id,
              role: tier,
            });
          }
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Subscription canceled", { subscriptionId: subscription.id });

        const { data: existingSub } = await supabaseAdmin
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", subscription.id)
          .single();

        if (existingSub) {
          await supabaseAdmin.from("subscriptions").update({
            status: "canceled",
          }).eq("stripe_subscription_id", subscription.id);

          // Remove paid roles, keep only free
          await supabaseAdmin.from("user_roles")
            .delete()
            .eq("user_id", existingSub.user_id)
            .neq("role", "free");

          // Mark referral as inactive
          await supabaseAdmin.from("referrals").update({
            status: "inactive",
          }).eq("subscription_id", subscription.id);
        }

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Payment failed", { invoiceId: invoice.id });

        // Optionally handle failed payments
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    logStep("ERROR", { message: error instanceof Error ? error.message : String(error) });
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
