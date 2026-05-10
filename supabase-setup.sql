-- AXIOM SUPABASE SCHEMA & SECURITY
-- Idempotent script for deployments table and RLS policies.

-- 1. Create/Update Table
CREATE TABLE IF NOT EXISTS public.deployments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    title TEXT NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    category TEXT DEFAULT 'General',
    impact_score INTEGER DEFAULT 0,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Ensure columns exist (for existing tables)
ALTER TABLE public.deployments ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';
ALTER TABLE public.deployments ADD COLUMN IF NOT EXISTS impact_score INTEGER DEFAULT 0;

-- 2. Security Setup
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;

-- Cleanup existing policies
DROP POLICY IF EXISTS "Users can view their own deployments" ON public.deployments;
DROP POLICY IF EXISTS "Users can insert their own deployments" ON public.deployments;
DROP POLICY IF EXISTS "Users can update their own deployments" ON public.deployments;
DROP POLICY IF EXISTS "Users can delete their own deployments" ON public.deployments;
DROP POLICY IF EXISTS "TEMPORARY DEBUG POLICY" ON public.deployments;

-- Standard Authenticated Policy (Ownership-based)
CREATE POLICY "Users can view their own deployments"
ON public.deployments FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own deployments"
ON public.deployments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deployments"
ON public.deployments FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own deployments"
ON public.deployments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 3. Grants
GRANT ALL ON public.deployments TO authenticated;
GRANT ALL ON public.deployments TO anon;
GRANT ALL ON public.deployments TO service_role;

-- 4. Indexes
CREATE INDEX IF NOT EXISTS deployments_user_id_idx ON public.deployments(user_id);
CREATE INDEX IF NOT EXISTS deployments_created_at_idx ON public.deployments(created_at DESC);
CREATE INDEX IF NOT EXISTS deployments_category_idx ON public.deployments(category);
