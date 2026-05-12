-- AXIOM FINANCIAL ACCOUNTS INFRASTRUCTURE (v1.0)
-- Establishing canonical containers of financial truth.

-- 1. Accounts Table
CREATE TABLE IF NOT EXISTS public.accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    account_name TEXT NOT NULL,
    account_type TEXT NOT NULL,
    current_balance NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
    currency TEXT DEFAULT 'KSh' NOT NULL,
    institution TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT accounts_account_type_check CHECK (
        account_type IN ('checking', 'savings', 'mobile_money', 'brokerage', 'crypto', 'cash')
    )
);

-- 2. Deployment Linking
-- Add optional account_id to deployments for capital traceability
ALTER TABLE public.deployments ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL;

-- 3. Security Setup (RLS)
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

-- Ensure users can only interact with their own accounts
DROP POLICY IF EXISTS "Users can view their own accounts" ON public.accounts;
DROP POLICY IF EXISTS "Users can insert their own accounts" ON public.accounts;
DROP POLICY IF EXISTS "Users can update their own accounts" ON public.accounts;
DROP POLICY IF EXISTS "Users can delete their own accounts" ON public.accounts;

CREATE POLICY "Users can view their own accounts" ON public.accounts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own accounts" ON public.accounts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own accounts" ON public.accounts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own accounts" ON public.accounts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 4. Grants
GRANT ALL ON public.accounts TO authenticated;
GRANT ALL ON public.accounts TO service_role;

-- 5. Indexes
CREATE INDEX IF NOT EXISTS accounts_user_id_idx ON public.accounts(user_id);
CREATE INDEX IF NOT EXISTS deployments_account_id_idx ON public.deployments(account_id);
