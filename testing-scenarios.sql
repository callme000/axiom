-- AXIOM SYSTEM-WIDE TEST SUITE (v4.0 - Solvency & Intent)
-- Testing User ID: 453007ef-8eba-4f6a-8d86-81445fc0af3d

---------------------------------------------------------
-- SCENARIO 0: CLEAN SLATE / SYSTEM RESET
---------------------------------------------------------
DELETE FROM public.deployments WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';
DELETE FROM public.liabilities WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';
DELETE FROM public.income_streams WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';
DELETE FROM public.financial_goals WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';
DELETE FROM public.accounts WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';
DELETE FROM public.kairos_insights WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';


---------------------------------------------------------
-- SCENARIO 1: SOLVENCY FOUNDATION (Zone 1 Verification)
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
-- SCENARIO 2: STRATEGIC INTENTION (Zone 1 + Zone 3 Verification)
-- Verifies goal progress aggregation and strategic fulfillment mean.
---------------------------------------------------------
INSERT INTO public.financial_goals (goal_name, goal_type, target_amount, current_progress, priority, status, user_id)
VALUES
('Emergency Fund (6M)', 'emergency_fund', 1200000.00, 300000.00, 'critical', 'active', '453007ef-8eba-4f6a-8d86-81445fc0af3d'),
('Retirement Seed', 'retirement', 5000000.00, 450000.00, 'high', 'active', '453007ef-8eba-4f6a-8d86-81445fc0af3d');


---------------------------------------------------------
-- SCENARIO 3: HIGH DISCIPLINE DEPLOYMENT (Zone 2 & 4 Verification)
-- Triggers: "High operational discipline in Asset accumulation..."
---------------------------------------------------------
INSERT INTO public.deployments (title, amount, category, user_id)
VALUES
('Index Fund Contribution', 50000.00, 'Asset', '453007ef-8eba-4f6a-8d86-81445fc0af3d'),
('Government Bond Purchase', 50000.00, 'Asset', '453007ef-8eba-4f6a-8d86-81445fc0af3d'),
('REIT Dividends Reinvestment', 25000.00, 'Asset', '453007ef-8eba-4f6a-8d86-81445fc0af3d');


---------------------------------------------------------
-- SCENARIO 4: LEAKAGE CRISIS
-- Triggers: "Capital efficiency crisis detected. Excessive 'Leakage'..."
---------------------------------------------------------
INSERT INTO public.deployments (title, amount, category, user_id)
VALUES
('Unplanned Luxury Subscription', 15000.00, 'Leakage', '453007ef-8eba-4f6a-8d86-81445fc0af3d'),
('Impulse Tech Acquisition', 85000.00, 'Leakage', '453007ef-8eba-4f6a-8d86-81445fc0af3d'),
('Gambling/Speculative Loss', 40000.00, 'Leakage', '453007ef-8eba-4f6a-8d86-81445fc0af3d');


---------------------------------------------------------
-- SCENARIO 5: RUNWAY STABILITY (Income Offset Test)
-- Target: Verify that runway remains stable despite high burn, due to replenishment.
---------------------------------------------------------
-- If Daily Burn (last 30d) = 5000 (150k total)
-- And Monthly Replenishment = 295k (Scenario 1)
-- Runway formula: (Liquidity + Monthly Offset) / Daily Burn
-- Should remain "Stable" or long-term despite the deployments.
UPDATE public.user_settings SET total_liquidity = 100000.00 WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';


---------------------------------------------------------
-- SCENARIO 6: CRITICAL OBLIGATION THREAT
-- High burn rate + Low Liquidity + High Liabilities.
---------------------------------------------------------
DELETE FROM public.income_streams WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';
UPDATE public.user_settings SET total_liquidity = 5000.00 WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';

INSERT INTO public.deployments (title, amount, category, user_id)
VALUES ('Emergency Repair', 150000.00, 'Leakage', '453007ef-8eba-4f6a-8d86-81445fc0af3d');
