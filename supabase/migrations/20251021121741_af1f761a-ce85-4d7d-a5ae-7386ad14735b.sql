-- Add index for faster queries on generations table
CREATE INDEX IF NOT EXISTS idx_generations_user_tool_date 
ON public.generations (user_id, tool_id, created_at DESC);

-- Add index for user_id and created_at for pagination
CREATE INDEX IF NOT EXISTS idx_generations_user_created 
ON public.generations (user_id, created_at DESC);