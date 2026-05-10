-- AXIOM KAIROS INTELLIGENCE TEST SUITE (v3.3 - Refined Priorities)
-- Testing User ID: 453007ef-8eba-4f6a-8d86-81445fc0af3d

---------------------------------------------------------
-- SCENARIO 0: CLEAN SLATE / RESET
---------------------------------------------------------
DELETE FROM public.deployments WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';
DELETE FROM public.kairos_insights WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';


---------------------------------------------------------
-- SCENARIO 1: HIGH DISCIPLINE (Opportunity)
-- Target: "High operational discipline in Asset accumulation..."
---------------------------------------------------------
DELETE FROM public.deployments WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';

INSERT INTO public.deployments (title, amount, category, user_id)
VALUES
('BTC Monthly Buy', 50000.00, 'Asset', '453007ef-8eba-4f6a-8d86-81445fc0af3d'),
('ETH Monthly Buy', 50000.00, 'Asset', '453007ef-8eba-4f6a-8d86-81445fc0af3d'),
('SOL Monthly Buy', 50000.00, 'Asset', '453007ef-8eba-4f6a-8d86-81445fc0af3d');


---------------------------------------------------------
-- SCENARIO 2: LEAKAGE CRISIS (High Priority Warning)
-- Target: "Capital efficiency crisis detected. Excessive 'Leakage'..."
-- Priority Logic: Wins over generic 'Runway' alert via higher confidence (0.99).
---------------------------------------------------------
DELETE FROM public.deployments WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';

INSERT INTO public.deployments (title, amount, category, user_id)
VALUES
('Emergency Impulse Expense', 1100000.00, 'Leakage', '453007ef-8eba-4f6a-8d86-81445fc0af3d'),
('Small Habit', 100.00, 'Leakage', '453007ef-8eba-4f6a-8d86-81445fc0af3d');


---------------------------------------------------------
-- SCENARIO 3: HEAVY CONCENTRATION (Low Priority Info)
-- Target: "Significant capital concentration detected in Leverage..."
-- Values chosen to keep volatility LOW so it doesn't trigger the Volatility warning.
---------------------------------------------------------
DELETE FROM public.deployments WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';

INSERT INTO public.deployments (title, amount, category, user_id)
VALUES
('Infrastructure Retainer A', 20000.00, 'Leverage', '453007ef-8eba-4f6a-8d86-81445fc0af3d'),
('Infrastructure Retainer B', 21000.00, 'Leverage', '453007ef-8eba-4f6a-8d86-81445fc0af3d'),
('Infrastructure Retainer C', 20500.00, 'Leverage', '453007ef-8eba-4f6a-8d86-81445fc0af3d'),
('Minor Habit', 500.00, 'Leakage', '453007ef-8eba-4f6a-8d86-81445fc0af3d');


---------------------------------------------------------
-- SCENARIO 4: ERRATIC VOLATILITY (Medium Priority Warning)
-- Target: "Erratic deployment patterns detected..."
---------------------------------------------------------
DELETE FROM public.deployments WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';

INSERT INTO public.deployments (title, amount, category, user_id)
VALUES
('Misc SaaS Fee', 500.00, 'Leverage', '453007ef-8eba-4f6a-8d86-81445fc0af3d'),
('One-Time Asset Acquisition', 400000.00, 'Asset', '453007ef-8eba-4f6a-8d86-81445fc0af3d');


---------------------------------------------------------
-- SCENARIO 5: RUNWAY DEPLETION (High Priority Warning)
-- Target: "Operational runway has contracted to X days..."
---------------------------------------------------------
DELETE FROM public.deployments WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';

INSERT INTO public.deployments (title, amount, category, user_id)
VALUES ('Large Capital Downpayment', 1400000.00, 'Asset', '453007ef-8eba-4f6a-8d86-81445fc0af3d');
