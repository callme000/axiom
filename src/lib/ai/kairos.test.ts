import assert from "node:assert/strict";
import test from "node:test";
import { interpretStrategicState } from "./kairos";
import { AnalyticsSummary } from "../analytics/types";

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
};

test("interpretStrategicState: silence behavior when healthy", () => {
  const result = interpretStrategicState(MOCK_ANALYTICS);
  assert.equal(result.isSilent, true);
  assert.equal(result.severity, "observation");
  assert.match(result.message, /No material structural deterioration/);
});

test("interpretStrategicState: severity calibration - critical (net worth negative)", () => {
  const analytics = {
    ...MOCK_ANALYTICS,
    netWorth: -100,
  };
  const result = interpretStrategicState(analytics);
  assert.equal(result.severity, "critical");
  assert.equal(result.isSilent, false);
});

test("interpretStrategicState: severity calibration - critical (low runway)", () => {
  const analytics = {
    ...MOCK_ANALYTICS,
    runwayDays: 10,
  };
  const result = interpretStrategicState(analytics);
  assert.equal(result.severity, "critical");
});

test("interpretStrategicState: solvency pressure interpretation", () => {
  const analytics = {
    ...MOCK_ANALYTICS,
    strategicAlignment: {
      ...MOCK_ANALYTICS.strategicAlignment,
      liquiditySufficiency: {
        isSufficient: false,
        message: "Shortfall detected.",
        shortfall: 500,
      },
    },
  };
  const result = interpretStrategicState(analytics);
  assert.equal(result.severity, "warning");
  assert.equal(result.category, "solvency_pressure");
  assert.equal(
    result.message,
    "Liquidity reserves are insufficient to satisfy all critical strategic obligations.",
  );
  assert.ok(result.supportingSignals.includes("Shortfall detected."));
});

test("interpretStrategicState: objective starvation interpretation", () => {
  const analytics = {
    ...MOCK_ANALYTICS,
    strategicAlignment: {
      ...MOCK_ANALYTICS.strategicAlignment,
      objectiveStarvationSignals: ["Goal X is starved."],
    },
  };
  const result = interpretStrategicState(analytics);
  assert.equal(result.severity, "advisory");
  assert.equal(result.category, "objective_starvation");
  assert.equal(result.message, "Goal X is starved.");
});

test("interpretStrategicState: capital efficiency interpretation (leakage vs assets)", () => {
  const analytics = {
    ...MOCK_ANALYTICS,
    strategicAlignment: {
      ...MOCK_ANALYTICS.strategicAlignment,
      strategicAllocationSignals: ["Leakage exceeded Asset deployments."],
    },
  };
  const result = interpretStrategicState(analytics);
  assert.equal(result.category, "capital_efficiency");
  assert.equal(result.message, "Leakage exceeded Asset deployments.");
});

test("interpretStrategicState: signal prioritization (limit to 3)", () => {
  const analytics = {
    ...MOCK_ANALYTICS,
    runwayDays: 20, // Should add runway signal
    adjustedDailyBurn: 100, // Should add burn signal
    strategicAlignment: {
      ...MOCK_ANALYTICS.strategicAlignment,
      alignmentPressure: 30, // Should add pressure signal
      objectiveStarvationSignals: ["Starvation 1"], // This will be the primary assessment
    },
  };
  const result = interpretStrategicState(analytics);
  assert.equal(result.message, "Starvation 1");
  assert.ok(result.supportingSignals.length <= 3);
});
