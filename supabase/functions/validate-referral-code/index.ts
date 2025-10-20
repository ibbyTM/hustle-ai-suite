import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.74.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Safe logging utility that masks sensitive data
const logStep = (step: string, details?: any) => {
  if (!details) {
    console.log(`[VALIDATE-REFERRAL-CODE] ${step}`);
    return;
  }
  
  const sanitized = JSON.stringify(details).replace(
    /(email|user_id|userId|referral_code|referralCode|code|ip_address|ip)["']?\s*:\s*["']?([^"',}\s]+)/gi,
    '$1: "***"'
  );
  console.log(`[VALIDATE-REFERRAL-CODE] ${step} - ${sanitized}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { referralCode, userId } = await req.json();
    
    if (!referralCode || typeof referralCode !== 'string') {
      logStep("Invalid input", { referralCode });
      return new Response(JSON.stringify({ 
        valid: false,
        error: "Invalid referral code format" 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Sanitize input - only allow alphanumeric characters, max 20 chars
    const sanitized = referralCode.trim().toUpperCase().slice(0, 20);
    if (!/^[A-Z0-9]+$/.test(sanitized)) {
      logStep("Invalid characters in referral code", { sanitized });
      return new Response(JSON.stringify({ 
        valid: false,
        error: "Referral code contains invalid characters" 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    logStep("Validating referral code", { sanitized });

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Rate limiting check - allow max 10 attempts per IP in last hour
    const clientIP = req.headers.get("x-forwarded-for") || "unknown";
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    const { count } = await supabaseClient
      .from("referral_validation_attempts")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", clientIP)
      .gte("created_at", oneHourAgo);

    if (count && count >= 10) {
      logStep("Rate limit exceeded", { ip: clientIP });
      return new Response(JSON.stringify({ 
        valid: false,
        error: "Too many validation attempts. Please try again later." 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 429,
      });
    }

    // Check if user is trying to use their own referral code (self-referral)
    if (userId) {
      const { data: userProfile } = await supabaseClient
        .from("profiles")
        .select("referral_code")
        .eq("user_id", userId)
        .single();

      if (userProfile?.referral_code === sanitized) {
        logStep("Self-referral attempt blocked", { userId });
        return new Response(JSON.stringify({ 
          valid: false,
          error: "You cannot use your own referral code" 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }
    }

    // Log validation attempt
    await supabaseClient.from("referral_validation_attempts").insert({
      user_id: userId || null,
      ip_address: clientIP,
      referral_code: sanitized,
    });

    // Use the security definer function to check if code exists
    const { data, error } = await supabaseClient.rpc('validate_referral_code_exists', {
      code: sanitized
    });

    if (error) {
      logStep("Database error", { error: error.message });
      throw error;
    }

    logStep("Validation complete", { valid: data, code: sanitized });

    return new Response(JSON.stringify({ valid: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ 
      valid: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
