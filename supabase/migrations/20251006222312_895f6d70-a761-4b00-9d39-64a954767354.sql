-- Create generations table to store user's AI-generated content
CREATE TABLE IF NOT EXISTS public.generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id TEXT NOT NULL,
  tool_title TEXT NOT NULL,
  tool_emoji TEXT NOT NULL,
  inputs JSONB NOT NULL DEFAULT '{}'::jsonb,
  output TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries by user_id and created_at
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON public.generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON public.generations(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own generations
CREATE POLICY "Users can view their own generations"
  ON public.generations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own generations
CREATE POLICY "Users can insert their own generations"
  ON public.generations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own generations
CREATE POLICY "Users can delete their own generations"
  ON public.generations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);