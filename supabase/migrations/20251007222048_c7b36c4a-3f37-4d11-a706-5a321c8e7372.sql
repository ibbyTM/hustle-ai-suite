-- Fix critical security vulnerability: Restrict earnings_history INSERT to service_role only
-- This prevents users from fabricating fake earnings records

-- Drop the vulnerable policy that allows anyone to insert
DROP POLICY IF EXISTS "System can insert earnings history" ON public.earnings_history;

-- Create new secure policy that only allows backend (service_role) to insert earnings
CREATE POLICY "Only service role can insert earnings"
ON public.earnings_history
FOR INSERT
WITH CHECK (auth.role() = 'service_role'::text);