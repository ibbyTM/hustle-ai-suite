-- Add unique constraint to prevent duplicate promo code redemptions
-- This prevents race conditions where multiple concurrent requests could redeem the same code
ALTER TABLE promo_code_redemptions
ADD CONSTRAINT unique_user_promo_redemption
UNIQUE (user_id, promo_code_id);