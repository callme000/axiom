-- AXIOM GOAL SYSTEM (v1.0)
-- Establishing deterministic awareness of strategic financial direction.

-- 1. Financial Goals Table
CREATE TABLE IF NOT EXISTS public.financial_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    goal_name TEXT NOT NULL,
    goal_type TEXT NOT NULL,
    target_amount NUMERIC(15, 2) NOT NULL,
    current_progress NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
    target_date DATE,
    priority TEXT DEFAULT 'medium' NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL,
    linked_account_ids UUID[] DEFAULT '{}'::UUID[] NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,

    CONSTRAINT financial_goals_goal_type_check CHECK (
        goal_type IN (
            'emergency_fund',
            'retirement',
            'home_purchase',
            'investment_target',
            'business_runway',
            'education',
            'debt_payoff',
            'wealth_preservation',
            'other'
        )
    ),
    CONSTRAINT financial_goals_priority_check CHECK (
        priority IN ('critical', 'high', 'medium', 'low')
    ),
    CONSTRAINT financial_goals_status_check CHECK (
        status IN ('active', 'paused', 'achieved', 'archived')
    ),
    CONSTRAINT financial_goals_target_amount_positive CHECK (target_amount > 0)
);

-- 2. Security Setup (RLS)
ALTER TABLE public.financial_goals ENABLE ROW LEVEL SECURITY;

-- Ensure users can only interact with their own goals
DROP POLICY IF EXISTS "Users can view their own goals" ON public.financial_goals;
DROP POLICY IF EXISTS "Users can insert their own goals" ON public.financial_goals;
DROP POLICY IF EXISTS "Users can update their own goals" ON public.financial_goals;
DROP POLICY IF EXISTS "Users can delete their own goals" ON public.financial_goals;

CREATE POLICY "Users can view their own goals" ON public.financial_goals FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own goals" ON public.financial_goals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goals" ON public.financial_goals FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own goals" ON public.financial_goals FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 3. Grants
GRANT ALL ON public.financial_goals TO authenticated;
GRANT ALL ON public.financial_goals TO service_role;

-- 4. Indexes
CREATE INDEX IF NOT EXISTS financial_goals_user_id_idx ON public.financial_goals(user_id);
CREATE INDEX IF NOT EXISTS financial_goals_status_idx ON public.financial_goals(status);
CREATE INDEX IF NOT EXISTS financial_goals_priority_idx ON public.financial_goals(priority);
