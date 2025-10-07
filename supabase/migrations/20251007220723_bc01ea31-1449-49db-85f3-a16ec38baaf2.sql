-- Phase 1 Critical Fix 1: Add INSERT policy for profiles table
CREATE POLICY "Users can insert their own profile during signup"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Phase 1 Critical Fix 3: Add timestamp tracking for referrals to prevent retroactive claims
ALTER TABLE public.referrals ADD COLUMN IF NOT EXISTS signup_timestamp TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Add index for faster referral code lookups
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles(referral_code);

-- Add rate limiting table for referral validation attempts
CREATE TABLE IF NOT EXISTS public.referral_validation_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT,
  referral_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.referral_validation_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own validation attempts"
ON public.referral_validation_attempts
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert validation attempts"
ON public.referral_validation_attempts
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- Create index for rate limiting queries
CREATE INDEX IF NOT EXISTS idx_referral_validation_attempts_created_at 
ON public.referral_validation_attempts(created_at);

CREATE INDEX IF NOT EXISTS idx_referral_validation_attempts_ip 
ON public.referral_validation_attempts(ip_address, created_at);