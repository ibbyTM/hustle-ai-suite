import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.74.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VALIDATE-REFERRAL-CODE] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { referralCode } = await req.json();
    
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
