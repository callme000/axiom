-- AXIOM SUPABASE EMERGENCY OVERRIDE
-- Use this ONLY if the standard RLS policies are failing during development.

-- 1. Reset
DROP POLICY IF EXISTS "Users can view their own deployments" ON public.deployments;
DROP POLICY IF EXISTS "Users can insert their own deployments" ON public.deployments;
DROP POLICY IF EXISTS "Users can update their own deployments" ON public.deployments;
DROP POLICY IF EXISTS "Users can delete their own deployments" ON public.deployments;
DROP POLICY IF EXISTS "TEMPORARY DEBUG POLICY" ON public.deployments;

-- 2. Create a "Permissive" policy for testing
-- This allows ANY authenticated user to do ANYTHING.
CREATE POLICY "TEMPORARY DEBUG POLICY"
ON public.deployments
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 3. Explicitly grant table permissions (just in case)
GRANT ALL ON public.deployments TO authenticated;
GRANT ALL ON public.deployments TO anon;
GRANT ALL ON public.deployments TO service_role;

-- 4. Ensure RLS is actually ON (if it's off, policies don't matter)
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;
