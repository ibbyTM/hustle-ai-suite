-- Fix security issue: Add DELETE policy to subscriptions table
-- Only service role (edge functions/webhooks) should be able to delete subscription records
CREATE POLICY "Only service role can delete subscriptions"
ON public.subscriptions
FOR DELETE
USING (auth.role() = 'service_role'::text);