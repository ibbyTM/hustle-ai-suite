import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Safe logging utility that masks sensitive data
const logStep = (step: string, details?: any) => {
  if (!details) {
    console.log(`[CREATE-CHECKOUT] ${step}`);
    return;
  }
  
  const sanitized = JSON.stringify(details).replace(
    /(email|user_id|userId|referral_code|referralCode|customer_id|customerId)["']?\s*:\s*["']?([^"',}\s]+)/gi,
    '$1: "***"'
  );
  console.log(`[CREATE-CHECKOUT] ${step} - ${sanitized}`);
};

// Price IDs for standard and discounted Pro tier
const PRO_PRICE_ID = "price_1SGR9aJLDxMViooDsH1mtAKY"; // £40/month standard price
const PRO_DISCOUNTED_PRICE_ID = "price_1SJL9jJLDxMViooDnvJet0TH"; // £30/month for Partner referrals (25% off)

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      throw new Error("User not authenticated or email not available");
    }

    logStep("User authenticated", { userId: user.id, email: user.email });

    const { priceId, referralCode } = await req.json();
    
    // Validate priceId
    if (!priceId || typeof priceId !== 'string' || !priceId.startsWith('price_')) {
      throw new Error("Invalid price ID format");
    }

    let finalPriceId = priceId;
    let sanitizedReferralCode;

    // Sanitize referralCode - use from request OR from user metadata (signup referral)
    if (referralCode) {
      if (typeof referralCode !== 'string' || referralCode.length > 20) {
        throw new Error("Invalid referral code format");
      }
      sanitizedReferralCode = referralCode.trim().toUpperCase();
      if (!/^[A-Z0-9]+$/.test(sanitizedReferralCode)) {
        throw new Error("Referral code contains invalid characters");
      }
    } else if (user.user_metadata?.referral_code) {
      // Use referral code from signup if not provided directly
      sanitizedReferralCode = String(user.user_metadata.referral_code).trim().toUpperCase();
      logStep("Using referral code from user metadata", { referralCode: sanitizedReferralCode });
    }

    // Check if user is signing up for Pro with a Partner referral code
    if (sanitizedReferralCode && priceId === PRO_PRICE_ID) {
      logStep("Checking if referral code belongs to Partner tier user", { referralCode: sanitizedReferralCode });
      
      // Find the referrer profile
      const { data: referrerProfile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('user_id')
        .eq('referral_code', sanitizedReferralCode)
        .maybeSingle();

      if (profileError) {
        logStep("Error fetching referrer profile", { error: profileError });
      } else if (referrerProfile) {
        // Check if referrer has Partner tier subscription
        const { data: referrerSubscription, error: subError } = await supabaseClient
          .from('subscriptions')
          .select('tier')
          .eq('user_id', referrerProfile.user_id)
          .maybeSingle();

        if (subError) {
          logStep("Error fetching referrer subscription", { error: subError });
        } else if (referrerSubscription?.tier === 'partner') {
          // Apply 25% discount - use discounted Pro price
          finalPriceId = PRO_DISCOUNTED_PRICE_ID;
          logStep("Partner referral detected - applying 25% discount to Pro", { 
            originalPrice: PRO_PRICE_ID, 
            discountedPrice: PRO_DISCOUNTED_PRICE_ID 
          });
        }
      }
    }

    logStep("Creating checkout session", { priceId: finalPriceId, referralCode: sanitizedReferralCode });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check for existing customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      client_reference_id: sanitizedReferralCode || undefined,
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/dashboard?success=true`,
      cancel_url: `${req.headers.get("origin")}/pricing?canceled=true`,
    });

    logStep("Session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
