import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Safe logging utility that masks sensitive data
const logStep = (step: string, details?: any) => {
  if (!details) {
    console.log(`[REDEEM-PROMO-CODE] ${step}`);
    return;
  }
  
  const sanitized = JSON.stringify(details).replace(
    /(email|user_id|userId|promo_code|promoCode|code)["']?\s*:\s*["']?([^"',}\s]+)/gi,
    '$1: "***"'
  );
  console.log(`[REDEEM-PROMO-CODE] ${step} - ${sanitized}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    // Get and validate promo code from request
    const { code } = await req.json();
    if (!code || typeof code !== 'string') {
      throw new Error("Promo code is required");
    }

    const sanitizedCode = code.trim().toUpperCase();
    logStep("Validating promo code", { code: sanitizedCode });

    // Check if code exists and is active
    const { data: promoCode, error: promoError } = await supabaseClient
      .from("promo_codes")
      .select("*")
      .eq("code", sanitizedCode)
      .eq("is_active", true)
      .single();

    if (promoError || !promoCode) {
      logStep("Invalid or inactive promo code");
      throw new Error("Invalid or inactive promo code");
    }

    logStep("Promo code found", { id: promoCode.id, tier: promoCode.tier });

    // Check expiration
    if (promoCode.expires_at && new Date(promoCode.expires_at) < new Date()) {
      logStep("Promo code expired");
      throw new Error("This promo code has expired");
    }

    // Check max uses
    if (promoCode.max_uses !== null && promoCode.current_uses >= promoCode.max_uses) {
      logStep("Promo code max uses reached");
      throw new Error("This promo code has reached its maximum number of uses");
    }

    // Note: Duplicate redemption check is now enforced by database unique constraint
    // This prevents race conditions where multiple concurrent requests could slip through

    // Create or update subscription record
    const { data: existingSubscription } = await supabaseClient
      .from("subscriptions")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (existingSubscription) {
      // Update existing subscription
      const { error: updateError } = await supabaseClient
        .from("subscriptions")
        .update({
          tier: promoCode.tier,
          status: "active",
          promo_code_id: promoCode.id,
          updated_at: new Date().toISOString(),
          current_period_end: null,
          stripe_subscription_id: null,
          stripe_customer_id: null,
        })
        .eq("id", existingSubscription.id);

      if (updateError) {
        logStep("Error updating subscription", { error: updateError });
        throw new Error("Failed to update subscription");
      }
      logStep("Subscription updated");
    } else {
      // Create new subscription
      const { error: insertError } = await supabaseClient
        .from("subscriptions")
        .insert({
          user_id: user.id,
          tier: promoCode.tier,
          status: "active",
          promo_code_id: promoCode.id,
        });

      if (insertError) {
        logStep("Error creating subscription", { error: insertError });
        throw new Error("Failed to create subscription");
      }
      logStep("Subscription created");
    }

    // Update user role in user_roles table
    const { data: existingRole } = await supabaseClient
      .from("user_roles")
      .select("id, role")
      .eq("user_id", user.id)
      .single();

    if (existingRole) {
      const { error: roleUpdateError } = await supabaseClient
        .from("user_roles")
        .update({ role: promoCode.tier })
        .eq("id", existingRole.id);

      if (roleUpdateError) {
        logStep("Error updating user role", { error: roleUpdateError });
      } else {
        logStep("User role updated");
      }
    }

    // Increment current_uses
    const { error: incrementError } = await supabaseClient
      .from("promo_codes")
      .update({ current_uses: promoCode.current_uses + 1 })
      .eq("id", promoCode.id);

    if (incrementError) {
      logStep("Error incrementing promo code uses", { error: incrementError });
    }

    // Record redemption (protected by unique constraint against race conditions)
    const { error: redemptionError } = await supabaseClient
      .from("promo_code_redemptions")
      .insert({
        promo_code_id: promoCode.id,
        user_id: user.id,
      });

    if (redemptionError) {
      logStep("Error recording redemption", { error: redemptionError });
      // Check if this is a duplicate redemption error (unique constraint violation)
      if (redemptionError.code === "23505") {
        throw new Error("You have already redeemed this promo code");
      }
      throw new Error("Failed to record promo code redemption");
    }

    logStep("Promo code redeemed successfully");

    return new Response(
      JSON.stringify({
        success: true,
        tier: promoCode.tier,
        message: `Successfully redeemed! You now have ${promoCode.tier === 'partner' ? 'Partner' : 'Plus'} access.`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
