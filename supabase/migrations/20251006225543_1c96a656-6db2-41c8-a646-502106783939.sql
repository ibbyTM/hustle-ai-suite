-- Create profiles table to store user referral codes
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create referrals table to track who referred whom
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(referrer_id, referred_id)
);

-- Create affiliate_stats table for caching earnings and stats
CREATE TABLE public.affiliate_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_referrals INTEGER NOT NULL DEFAULT 0,
  active_subscribers INTEGER NOT NULL DEFAULT 0,
  earnings_this_month NUMERIC(10,2) NOT NULL DEFAULT 0,
  lifetime_earnings NUMERIC(10,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Function to generate unique referral codes
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE referral_code = code) INTO exists;
    
    EXIT WHEN NOT exists;
  END LOOP;
  
  RETURN code;
END;
$$;

-- Trigger to auto-generate referral code on profile creation
CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
    NEW.referral_code := public.generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_referral_code
BEFORE INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_profile();

-- Trigger to create profile and stats when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, referral_code)
  VALUES (NEW.id, public.generate_referral_code());
  
  -- Create affiliate stats
  INSERT INTO public.affiliate_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Function to update affiliate stats
CREATE OR REPLACE FUNCTION public.update_affiliate_stats(user_id_param UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_refs INTEGER;
  active_subs INTEGER;
BEGIN
  -- Count total referrals
  SELECT COUNT(*) INTO total_refs
  FROM public.referrals
  WHERE referrer_id = user_id_param;
  
  -- Count active subscribers
  SELECT COUNT(*) INTO active_subs
  FROM public.referrals
  WHERE referrer_id = user_id_param AND status = 'active';
  
  -- Update stats (earnings calculation would be based on subscription data)
  UPDATE public.affiliate_stats
  SET 
    total_referrals = total_refs,
    active_subscribers = active_subs,
    updated_at = now()
  WHERE user_id = user_id_param;
END;
$$;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view referral codes for validation"
ON public.profiles
FOR SELECT
USING (true);

-- RLS Policies for referrals
CREATE POLICY "Users can view their own referrals"
ON public.referrals
FOR SELECT
USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "System can insert referrals"
ON public.referrals
FOR INSERT
WITH CHECK (true);

CREATE POLICY "System can update referrals"
ON public.referrals
FOR UPDATE
USING (true);

-- RLS Policies for affiliate_stats
CREATE POLICY "Users can view their own stats"
ON public.affiliate_stats
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can update stats"
ON public.affiliate_stats
FOR UPDATE
USING (true);