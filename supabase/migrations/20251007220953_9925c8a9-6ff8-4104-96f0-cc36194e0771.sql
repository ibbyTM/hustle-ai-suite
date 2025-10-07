-- Fix critical security issue: Restrict affiliate_stats updates to service role only
-- Drop the insecure policy that allows anyone to update stats
DROP POLICY IF EXISTS "System can update stats" ON public.affiliate_stats;

-- Create secure policy that only allows service role (edge functions) to update stats
CREATE POLICY "Only service role can update stats"
ON public.affiliate_stats
FOR UPDATE
USING (auth.role() = 'service_role'::text)
WITH CHECK (auth.role() = 'service_role'::text);