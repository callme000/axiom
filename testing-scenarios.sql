-- AXIOM KAIROS INTELLIGENCE TEST SUITE (v2.4)
-- Testing User ID: 453007ef-8eba-4f6a-8d86-81445fc0af3d

---------------------------------------------------------
-- SCENARIO 0: CLEAN SLATE / RESET
---------------------------------------------------------
DELETE FROM public.deployments WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';
DELETE FROM public.kairos_insights WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';


---------------------------------------------------------
-- SCENARIO 1: RUNWAY CRITICALITY (High Priority)
-- Target: "Operational runway has contracted..."
---------------------------------------------------------
DELETE FROM public.deployments WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';

INSERT INTO public.deployments (title, amount, category, user_id)
VALUES ('Major Infrastructure Overhaul', 1200000.00, 'Infrastructure', '453007ef-8eba-4f6a-8d86-81445fc0af3d');


---------------------------------------------------------
-- SCENARIO 2: EFFICIENCY CRISIS (High Priority)
-- Target: "Capital efficiency has reached a critical threshold..."
---------------------------------------------------------
DELETE FROM public.deployments WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';

INSERT INTO public.deployments (title, amount, category, user_id)
VALUES
('Marketing Experiment', 900000.00, 'Marketing', '453007ef-8eba-4f6a-8d86-81445fc0af3d'),
('Small Tool', 50.00, 'Operations', '453007ef-8eba-4f6a-8d86-81445fc0af3d');


---------------------------------------------------------
-- SCENARIO 3: HEAVY CONCENTRATION (Low Priority)
-- Target: "Significant capital concentration detected..."
-- Logic: One category represents > 70% of total.
---------------------------------------------------------
DELETE FROM public.deployments WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';

INSERT INTO public.deployments (title, amount, category, user_id)
VALUES
('R&D Phase 1', 100000.00, 'R&D', '453007ef-8eba-4f6a-8d86-81445fc0af3d'),
('R&D Phase 2', 100000.00, 'R&D', '453007ef-8eba-4f6a-8d86-81445fc0af3d'),
('R&D Phase 3', 100000.00, 'R&D', '453007ef-8eba-4f6a-8d86-81445fc0af3d'),
('Office Water', 1000.00, 'Operations', '453007ef-8eba-4f6a-8d86-81445fc0af3d');


---------------------------------------------------------
-- SCENARIO 4: ERRATIC VOLATILITY (Medium Priority)
-- Target: "Erratic deployment patterns detected..."
---------------------------------------------------------
DELETE FROM public.deployments WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';

INSERT INTO public.deployments (title, amount, category, user_id)
VALUES
('Cloud Fees', 500.00, 'Infrastructure', '453007ef-8eba-4f6a-8d86-81445fc0af3d'),
('Annual Server Lease', 300000.00, 'Infrastructure', '453007ef-8eba-4f6a-8d86-81445fc0af3d');


---------------------------------------------------------
-- SCENARIO 5: HIGH DISCIPLINE (Medium Priority)
-- Target: "High operational discipline detected..."
-- Logic: Multiple deployments with identical or consistent amounts.
---------------------------------------------------------
DELETE FROM public.deployments WHERE user_id = '453007ef-8eba-4f6a-8d86-81445fc0af3d';

INSERT INTO public.deployments (title, amount, category, user_id)
VALUES
('Monthly Salary A', 100000.00, 'Operations', '453007ef-8eba-4f6a-8d86-81445fc0af3d'),
('Monthly Salary B', 100000.00, 'Operations', '453007ef-8eba-4f6a-8d86-81445fc0af3d'),
('Monthly Salary C', 100000.00, 'Operations', '453007ef-8eba-4f6a-8d86-81445fc0af3d');
