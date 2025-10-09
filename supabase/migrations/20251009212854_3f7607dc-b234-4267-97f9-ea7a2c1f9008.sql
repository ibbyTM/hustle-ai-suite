-- Create promo_codes table
CREATE TABLE public.promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  tier app_role NOT NULL,
  max_uses integer,
  current_uses integer DEFAULT 0 NOT NULL,
  expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  is_active boolean DEFAULT true NOT NULL,
  description text
);

-- Index for faster lookups
CREATE INDEX idx_promo_codes_code ON public.promo_codes(code) WHERE is_active = true;

-- Create promo_code_redemptions table
CREATE TABLE public.promo_code_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id uuid REFERENCES public.promo_codes(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  redeemed_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(promo_code_id, user_id)
);

CREATE INDEX idx_promo_redemptions_user ON public.promo_code_redemptions(user_id);

-- Enable RLS
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_code_redemptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for promo_codes
CREATE POLICY "Anyone can read active promo codes"
ON public.promo_codes
FOR SELECT
USING (is_active = true);

CREATE POLICY "Only service role can manage promo codes"
ON public.promo_codes
FOR ALL
USING (auth.role() = 'service_role'::text);

-- RLS Policies for promo_code_redemptions
CREATE POLICY "Users can view their own redemptions"
ON public.promo_code_redemptions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage redemptions"
ON public.promo_code_redemptions
FOR ALL
USING (auth.role() = 'service_role'::text);

-- Add promo_code_id column to subscriptions table to track which code was used
ALTER TABLE public.subscriptions 
ADD COLUMN promo_code_id uuid REFERENCES public.promo_codes(id);