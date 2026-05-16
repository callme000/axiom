-- AXIOM LIABILITY SYSTEM (v1.0)
-- Establishing deterministic awareness of financial obligations.

-- 1. Liabilities Table
CREATE TABLE IF NOT EXISTS public.liabilities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    liability_name TEXT NOT NULL,
    liability_type TEXT NOT NULL,
    outstanding_balance NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
    interest_rate NUMERIC(5, 2) DEFAULT 0.00 NOT NULL,
    minimum_payment NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
    due_date DATE,
    currency TEXT DEFAULT 'KSh' NOT NULL,
    institution TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT liabilities_liability_type_check CHECK (
        liability_type IN (
            'credit_card',
            'mortgage',
            'personal_loan',
            'student_loan',
            'business_loan',
            'line_of_credit',
            'other'
        )
    )
);

-- 2. Security Setup (RLS)
ALTER TABLE public.liabilities ENABLE ROW LEVEL SECURITY;

-- Ensure users can only interact with their own liabilities
DROP POLICY IF EXISTS "Users can view their own liabilities" ON public.liabilities;
DROP POLICY IF EXISTS "Users can insert their own liabilities" ON public.liabilities;
DROP POLICY IF EXISTS "Users can update their own liabilities" ON public.liabilities;
DROP POLICY IF EXISTS "Users can delete their own liabilities" ON public.liabilities;

CREATE POLICY "Users can view their own liabilities" ON public.liabilities FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own liabilities" ON public.liabilities FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own liabilities" ON public.liabilities FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own liabilities" ON public.liabilities FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 3. Grants
GRANT ALL ON public.liabilities TO authenticated;
GRANT ALL ON public.liabilities TO service_role;

-- 4. Indexes
CREATE INDEX IF NOT EXISTS liabilities_user_id_idx ON public.liabilities(user_id);
CREATE INDEX IF NOT EXISTS liabilities_due_date_idx ON public.liabilities(due_date);
