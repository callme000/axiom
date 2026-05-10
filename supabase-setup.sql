-- AXIOM SUPABASE SCHEMA & SECURITY (v2.2)
-- Idempotent script for deployments and kairos_insights.

-- 1. Deployments Table
CREATE TABLE IF NOT EXISTS public.deployments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    title TEXT NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    category TEXT DEFAULT 'General',
    impact_score INTEGER DEFAULT 0,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Ensure columns exist
ALTER TABLE public.deployments ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';
ALTER TABLE public.deployments ADD COLUMN IF NOT EXISTS impact_score INTEGER DEFAULT 0;

-- 2. Kairos Insights Table (Memory Layer)
CREATE TABLE IF NOT EXISTS public.kairos_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('warning', 'info', 'pattern', 'opportunity')),
    category TEXT NOT NULL,
    confidence NUMERIC(3, 2) NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 3. Security Setup (RLS)
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kairos_insights ENABLE ROW LEVEL SECURITY;

-- Cleanup existing policies
DROP POLICY IF EXISTS "Users can view their own deployments" ON public.deployments;
DROP POLICY IF EXISTS "Users can insert their own deployments" ON public.deployments;
DROP POLICY IF EXISTS "Users can view their own insights" ON public.kairos_insights;
DROP POLICY IF EXISTS "Users can insert their own insights" ON public.kairos_insights;

-- Policies for Deployments
CREATE POLICY "Users can view their own deployments" ON public.deployments FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own deployments" ON public.deployments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Policies for Insights
CREATE POLICY "Users can view their own insights" ON public.kairos_insights FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own insights" ON public.kairos_insights FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 4. Grants
GRANT ALL ON public.deployments TO authenticated;
GRANT ALL ON public.kairos_insights TO authenticated;
GRANT ALL ON public.deployments TO service_role;
GRANT ALL ON public.kairos_insights TO service_role;

-- 5. Indexes
CREATE INDEX IF NOT EXISTS deployments_user_id_idx ON public.deployments(user_id);
CREATE INDEX IF NOT EXISTS insights_user_id_idx ON public.kairos_insights(user_id);
CREATE INDEX IF NOT EXISTS insights_created_at_idx ON public.kairos_insights(created_at DESC);
