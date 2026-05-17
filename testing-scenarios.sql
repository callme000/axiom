-- AXIOM SYSTEM-WIDE TEST SUITE (v5.0 - Strategic Interpretation Phase 5E)
-- Testing User ID: 453007ef-8eba-4f6a-8d86-81445fc0af3d
-- Identity: Restrained Operational Intelligence

---------------------------------------------------------
-- SCENARIO 0: CLEAN SLATE / SYSTEM RESET
---------------------------------------------------------
DELETE FROM public.deployments WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';
DELETE FROM public.liabilities WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';
DELETE FROM public.income_streams WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';
DELETE FROM public.financial_goals WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';
DELETE FROM public.strategic_objectives WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';
DELETE FROM public.accounts WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';
DELETE FROM public.kairos_insights WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';

-- Initialize default settings
INSERT INTO public.user_settings (user_id, total_liquidity)
VALUES ('453007ef-8eba-4f6a-8d86-81445fc0af3d', 100000)
ON CONFLICT (user_id) DO UPDATE SET total_liquidity = 100000;


---------------------------------------------------------
-- SCENARIO 1: SOLVENCY FOUNDATION
-- Establishes authoritative capital, obligations, and replenishment.
---------------------------------------------------------
INSERT INTO public.accounts (account_name, account_type, current_balance, user_id)
VALUES
('Primary Checking', 'checking', 150000.00, '453007ef-8eba-4f6a-8d86-81445fc0af3d'),
('Brokerage Alpha', 'brokerage', 450000.00, '453007ef-8eba-4f6a-8d86-81445fc0af3d');

INSERT INTO public.liabilities (liability_name, liability_type, outstanding_balance, minimum_payment, interest_rate, user_id)
VALUES
('Vehicle Loan', 'personal_loan', 200000.00, 15000.00, 12.5, '453007ef-8eba-4f6a-8d86-81445fc0af3d'),
('Corporate Credit Card', 'credit_card', 45000.00, 5000.00, 18.0, '453007ef-8eba-4f6a-8d86-81445fc0af3d');

INSERT INTO public.income_streams (income_name, income_type, amount, cadence, is_recurring, user_id)
VALUES
('Primary Salary', 'salary', 250000.00, 'monthly', true, '453007ef-8eba-4f6a-8d86-81445fc0af3d'),
('Freelance Retainer', 'freelance', 45000.00, 'monthly', true, '453007ef-8eba-4f6a-8d86-81445fc0af3d');


---------------------------------------------------------
-- SCENARIO 2: STRATEGIC INTENTION (PHASE 5E)
-- Verifies objective progress aggregation and interpretive signals.
---------------------------------------------------------
INSERT INTO public.strategic_objectives (objective_name, objective_type, target_amount, current_amount, priority_level, status, user_id)
VALUES
('Emergency Reserve Alpha', 'emergency_reserve', 1200000.00, 300000.00, 'critical', 'active', '453007ef-8eba-4f6a-8d86-81445fc0af3d'),
('Retirement positioning', 'retirement', 5000000.00, 450000.00, 'high', 'active', '453007ef-8eba-4f6a-8d86-81445fc0af3d');


---------------------------------------------------------
-- SCENARIO 3: SOLVENCY PRESSURE (PHASE 5E TRIGGER)
-- Context: Critical objective target exceeds available liquidity.
-- Expectation: Kairos flags "Liquidity reserves are insufficient..."
---------------------------------------------------------
-- Critical Target (1.2M) vs Liquidity (100k + 150k checking) = 250k.
-- Shortfall detected.


---------------------------------------------------------
-- SCENARIO 4: STRATEGIC CONFLICT (CAPITAL EFFICIENCY)
-- Context: Active accumulation, but Leakage > Assets.
---------------------------------------------------------
INSERT INTO public.deployments (title, amount, category, user_id, created_at)
VALUES
('Suboptimal Subscription Batch', 85000.00, 'Leakage', '453007ef-8eba-4f6a-8d86-81445fc0af3d', now() - interval '2 days'),
('Index Fund Contribution', 15000.00, 'Asset', '453007ef-8eba-4f6a-8d86-81445fc0af3d', now() - interval '5 days');


---------------------------------------------------------
-- SCENARIO 5: OBJECTIVE STARVATION
-- Context: Active objective with < 10% progress created > 90 days ago.
---------------------------------------------------------
INSERT INTO public.strategic_objectives (objective_name, objective_type, target_amount, current_amount, priority_level, status, user_id, created_at)
VALUES
('Venture Capital Base', 'investment', 10000000.00, 100000.00, 'moderate', 'active', '453007ef-8eba-4f6a-8d86-81445fc0af3d', now() - interval '100 days');


---------------------------------------------------------
-- SCENARIO 6: CRITICAL SEVERITY (SOLVENCY CRISIS)
-- Context: Negative net worth or catastrophic burn.
---------------------------------------------------------
-- Force high liability to trigger critical severity
INSERT INTO public.liabilities (liability_name, liability_type, outstanding_balance, user_id)
VALUES ('Predatory High-Interest Loan', 'personal_loan', 2500000.00, '453007ef-8eba-4f6a-8d86-81445fc0af3d');


---------------------------------------------------------
-- SCENARIO 7: ALIGNMENT STABILITY (SILENCE)
-- Context: No conflicts, sufficient liquidity, active progress.
---------------------------------------------------------
-- To test silence, run Scenario 0 (Cleanup) then insert balanced data:
 INSERT INTO public.accounts (account_name, current_balance, user_id) VALUES ('Vault', 2000000, '453007ef-8eba-4f6a-8d86-81445fc0af3d');
 INSERT INTO public.strategic_objectives (objective_name, target_amount, current_amount, priority_level, status, user_id)
 VALUES ('Base Reserve', 500000, 450000, 'low', 'active', '453007ef-8eba-4f6a-8d86-81445fc0af3d');
