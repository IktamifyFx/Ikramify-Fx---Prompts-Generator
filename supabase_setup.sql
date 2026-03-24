-- Supabase SQL instructions for the user
-- Run this in your Supabase SQL Editor to create the required table

CREATE TABLE saved_prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE saved_prompts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own prompts" 
  ON saved_prompts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own prompts" 
  ON saved_prompts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prompts" 
  ON saved_prompts FOR DELETE 
  USING (auth.uid() = user_id);
