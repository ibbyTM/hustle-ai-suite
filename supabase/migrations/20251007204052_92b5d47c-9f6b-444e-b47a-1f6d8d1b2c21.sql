-- Phase 1: Fix Critical Security Issues

-- 1. Fix subscriptions table RLS policies
-- Drop insecure policies that allow any authenticated user to modify subscriptions
DROP POLICY IF EXISTS "System can insert subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "System can update subscriptions" ON public.subscriptions;

-- Create secure policies that only allow service role (webhooks) to modify
CREATE POLICY "Service role can insert subscriptions" 
ON public.subscriptions 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update subscriptions" 
ON public.subscriptions 
FOR UPDATE 
USING (auth.role() = 'service_role');

-- 2. Fix profiles table public exposure
-- Drop the policy that makes all profiles publicly readable
DROP POLICY IF EXISTS "Anyone can view referral codes for validation" ON public.profiles;

-- Create a security definer function to validate referral codes without exposing all data
CREATE OR REPLACE FUNCTION public.validate_referral_code_exists(code text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE referral_code = code
  );
$$;

-- 3. Fix referrals table - add unique constraint to prevent duplicate referrals
-- First drop existing constraint if it exists
ALTER TABLE public.referrals DROP CONSTRAINT IF EXISTS unique_referral_pair;

-- Add unique constraint on referrer_id and referred_id pair
ALTER TABLE public.referrals ADD CONSTRAINT unique_referral_pair 
UNIQUE (referrer_id, referred_id);

-- 4. Update referrals RLS policies to be more restrictive
DROP POLICY IF EXISTS "System can insert referrals" ON public.referrals;
DROP POLICY IF EXISTS "System can update referrals" ON public.referrals;

-- Only service role can insert/update referrals (from webhooks)
CREATE POLICY "Service role can insert referrals" 
ON public.referrals 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update referrals" 
ON public.referrals 
FOR UPDATE 
USING (auth.role() = 'service_role');