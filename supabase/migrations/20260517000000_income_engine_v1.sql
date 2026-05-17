-- AXIOM INCOME ENGINE (v1.0)
-- Establishing deterministic awareness of financial replenishment.

-- 1. Income Streams Table
CREATE TABLE IF NOT EXISTS public.income_streams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    income_name TEXT NOT NULL,
    income_type TEXT NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    cadence TEXT NOT NULL,
    is_recurring BOOLEAN DEFAULT true NOT NULL,
    currency TEXT DEFAULT 'KSh' NOT NULL,
    source TEXT,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT income_streams_income_type_check CHECK (
        income_type IN (
            'salary',
            'freelance',
            'business',
            'dividends',
            'rental',
            'contract',
            'other'
        )
    ),
    CONSTRAINT income_streams_cadence_check CHECK (
        cadence IN (
            'weekly',
            'biweekly',
            'monthly',
            'quarterly',
            'annually',
            'irregular'
        )
    )
);

-- 2. Security Setup (RLS)
ALTER TABLE public.income_streams ENABLE ROW LEVEL SECURITY;

-- Ensure users can only interact with their own income streams
DROP POLICY IF EXISTS "Users can view their own income streams" ON public.income_streams;
DROP POLICY IF EXISTS "Users can insert their own income streams" ON public.income_streams;
DROP POLICY IF EXISTS "Users can update their own income streams" ON public.income_streams;
DROP POLICY IF EXISTS "Users can delete their own income streams" ON public.income_streams;

CREATE POLICY "Users can view their own income streams" ON public.income_streams FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own income streams" ON public.income_streams FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own income streams" ON public.income_streams FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own income streams" ON public.income_streams FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 3. Grants
GRANT ALL ON public.income_streams TO authenticated;
GRANT ALL ON public.income_streams TO service_role;

-- 4. Indexes
CREATE INDEX IF NOT EXISTS income_streams_user_id_idx ON public.income_streams(user_id);
CREATE INDEX IF NOT EXISTS income_streams_start_date_idx ON public.income_streams(start_date);
