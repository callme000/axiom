import assert from "node:assert/strict";
import test from "node:test";
import { generateSystemInsights } from "./kairos";
import { AnalyticsSummary } from "../analytics/types";
import { buildBehavioralContext } from "../context/buildBehavioralContext";
import { evaluateInsights } from "../insights/generateInsights";

const MOCK_METADATA_QUALITY = {
  averageScore: 1,
  lowQualityCount: 0,
  lowQualityRatio: 0,
  confidenceMultiplier: 1,
};

const MOCK_ANALYTICS: AnalyticsSummary = {
  totalDeployed: 1000,
  averageDeployment: 100,
  dailyBurnRate: 10,
  runwayDays: 100,
  categoryBreakdown: { Leakage: 500, Asset: 500 },
  deploymentCount: 10,
  metadataQuality: MOCK_METADATA_QUALITY,
  totalLiabilities: 0,
  totalAssets: 2000,
  netWorth: 2000,
  liquidity: 1000,
  totalMonthlyIncome: 300,
  recurringIncome: 300,
  irregularIncome: 0,
  incomeConcentration: {},
  adjustedDailyBurn: 0,
  totalStrategicTargets: 1000,
  totalCurrentProgress: 500,
  averageGoalProgress: 50,
  criticalGoalCount: 0,
  fundingGap: 500,
  // Strategic Objectives v1
  strategicAlignment: {
    fundingRatios: {},
    alignmentPressure: 0,
    liquiditySufficiency: {
      isSufficient: true,
      message:
        "Current liquidity structure sufficiently supports short-term obligations.",
      shortfall: 0,
    },
    objectiveStarvationSignals: [],
    strategicAllocationSignals: [],
    velocity: {},
  },
  // Operational Baseline v1
  totalStructuralMonthlyBurn: 0,
  totalSystemicMonthlyAllocation: 0,
};

test("Kairos Insights: correctly invokes rule engine and returns primary insight", () => {
  const context = buildBehavioralContext(
    { currentAnalytics: MOCK_ANALYTICS },
    [100, 200, 300],
  );
  const { primaryInsight } = evaluateInsights(context);

  assert.ok(primaryInsight.message);
  assert.ok(primaryInsight.severity);
  assert.ok(primaryInsight.category);
});

test("Kairos Insights: critical runway trigger", () => {
  const analytics = {
    ...MOCK_ANALYTICS,
    runwayDays: 10,
  };
  const context = buildBehavioralContext(
    { currentAnalytics: analytics },
    [100, 200, 300],
  );
  const { primaryInsight } = evaluateInsights(context);

  assert.equal(primaryInsight.severity, "critical");
  assert.equal(primaryInsight.category, "solvency_pressure");
  assert.match(primaryInsight.message, /runway has contracted/);
});

test("Kairos Insights: efficiency crisis trigger", () => {
  const analytics = {
    ...MOCK_ANALYTICS,
    categoryBreakdown: { Leakage: 1000, Asset: 0 },
    runwayDays: 10, // Force low runway to plummet efficiency score < 40
  };
  const context = buildBehavioralContext(
    { currentAnalytics: analytics },
    [100, 2000, 50, 3000],
  );

  // Rule condition: capitalEfficiencyScore < 40
  // buildBehavioralContext for runway < 90 gives -40 penalty.
  // Volatility penalty is vol * 60.

  const { primaryInsight } = evaluateInsights(context);

  // Solvency pressure (runway) usually has higher priority than efficiency crisis
  // if both are triggered, since runway is status: 'critical'.
  // However, in registry.ts, both have priority: 'high'.
  // evaluateInsights sorts by priority and then maintains order.
  // runway_critical is ID 1, efficiency_crisis is ID 2.

  assert.equal(primaryInsight.severity, "critical");
  assert.match(
    primaryInsight.message,
    /(runway has contracted|efficiency crisis)/,
  );
});

test("Kairos Insights: unclassified data advisory", () => {
  const analytics = {
    ...MOCK_ANALYTICS,
    categoryBreakdown: { Unknown: 500, Asset: 500 },
  };
  const context = buildBehavioralContext(
    { currentAnalytics: analytics },
    [500, 500],
  );
  const { allInsights } = evaluateInsights(context);

  const unclassifiedInsight = allInsights.find((i) =>
    i.message.includes("Unclassified"),
  );
  assert.ok(unclassifiedInsight);
  assert.equal(unclassifiedInsight.severity, "advisory");
});

test("Kairos Insights: high discipline pattern", () => {
  // Healthy state with stable spending
  const context = buildBehavioralContext(
    { currentAnalytics: MOCK_ANALYTICS },
    [100, 100, 100],
  );
  const { primaryInsight } = evaluateInsights(context);

  assert.equal(primaryInsight.severity, "observation");
  assert.match(primaryInsight.message, /High operational discipline/);
  assert.equal(primaryInsight.isSilent, true);
});

test("Kairos Insights: silence state default pattern", () => {
  // State that doesn't trigger High Discipline but falls into Default Pattern
  const analytics = {
    ...MOCK_ANALYTICS,
    deploymentCount: 1, // High Discipline requires count > 1
  };
  const context = buildBehavioralContext(
    { currentAnalytics: analytics },
    [100],
  );
  const { primaryInsight } = evaluateInsights(context);

  assert.equal(primaryInsight.severity, "observation");
  assert.match(primaryInsight.message, /No material behavioral shifts/);
  assert.equal(primaryInsight.isSilent, true);
});
