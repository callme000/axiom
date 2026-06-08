import assert from "node:assert/strict";
import test from "node:test";
import {
  projectRunway,
  calculateBurnRate,
  calculateIncomeMetrics,
  countPendingVerifications,
} from "./engine";
import type { Deployment, IncomeStream, OperationalBaseline } from "./types";

test("projectRunway handles dimensional math correctly", () => {
  // Scenario: 1000 balance, 10 daily burn, 0 income
  // Runway = 1000 / 10 = 100 days
  assert.equal(projectRunway(1000, 10, 0), 100);

  // Scenario: 1000 balance, 10 daily burn, 150 monthly income
  // adjustedDailyBurn = 10 - (150 / 30) = 5
  // Runway = 1000 / 5 = 200 days
  assert.equal(projectRunway(1000, 10, 150), 200);
});

test("projectRunway returns null when state is stable (income >= burn)", () => {
  // Scenario: 10 daily burn, 300 monthly income
  // adjustedDailyBurn = 10 - (300 / 30) = 0
  assert.equal(projectRunway(1000, 10, 300), null);

  // Scenario: 10 daily burn, 450 monthly income
  // adjustedDailyBurn = 10 - (450 / 30) = -5
  assert.equal(projectRunway(1000, 10, 450), null);
});

test("projectRunway returns 0 when balance is 0 or negative (and burn > income)", () => {
  assert.equal(projectRunway(0, 10, 0), 0);
  assert.equal(projectRunway(-100, 10, 0), 0);
});

test("projectRunway returns null when dailyBurnRate is 0 or negative (unstable state but no burn)", () => {
  assert.equal(projectRunway(1000, 0, 0), null);
  assert.equal(projectRunway(1000, -5, 0), null);
});

test("calculateBurnRate remains deterministic", () => {
  const deployments: Deployment[] = [
    {
      id: "1",
      amount: 300,
      title: "Rent",
      category: "Leakage",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      amount: 150,
      title: "Cloud",
      category: "Leverage",
      created_at: new Date().toISOString(),
    },
  ];

  // 450 total / 30 days = 15/day
  assert.equal(calculateBurnRate(deployments, 30), 15);
});

test("calculateMaxIncomeConcentration: 90% dependency", () => {
  const streams: Partial<IncomeStream>[] = [
    {
      income_name: "Source A",
      amount: 900,
      cadence: "monthly",
      income_type: "salary",
      is_recurring: true,
    },
    {
      income_name: "Source B",
      amount: 100,
      cadence: "monthly",
      income_type: "freelance",
      is_recurring: true,
    },
  ];

  // total = 1000
  // max = 900
  // ratio = 0.9
  const metrics = calculateIncomeMetrics(streams as IncomeStream[]);
  assert.equal(metrics.maxRatio, 0.9);
});

test("calculateMaxIncomeConcentration: balanced split", () => {
  const streams: Partial<IncomeStream>[] = [
    {
      income_name: "Source A",
      amount: 100,
      cadence: "monthly",
      income_type: "salary",
      is_recurring: true,
    },
    {
      income_name: "Source B",
      amount: 100,
      cadence: "monthly",
      income_type: "salary",
      is_recurring: true,
    },
    {
      income_name: "Source C",
      amount: 100,
      cadence: "monthly",
      income_type: "salary",
      is_recurring: true,
    },
  ];

  // total = 300
  // max = 100
  // ratio = 0.333...
  const metrics = calculateIncomeMetrics(streams as IncomeStream[]);
  assert.ok(Math.abs(metrics.maxRatio - 0.3333333333333333) < 0.0001);
});

test("calculateMaxIncomeConcentration: zero income", () => {
  const metrics = calculateIncomeMetrics([]);
  assert.equal(metrics.maxRatio, 0);
});

test("countPendingVerifications includes baseline logic", () => {
  const today = new Date();
  const currentDayOfMonth = today.getDate();
  const currentDayOfWeek = today.getDay() === 0 ? 7 : today.getDay();

  const baseline: Partial<OperationalBaseline>[] = [
    {
      id: "b1",
      title: "Daily Coffee",
      cadence: "daily",
      is_recurring: true,
      last_executed_at: null,
    },
    {
      id: "b2",
      title: "Weekly Server",
      cadence: "weekly",
      is_recurring: true,
      execution_day: currentDayOfWeek,
      last_executed_at: null,
    },
    {
      id: "b3",
      title: "Monthly Rent",
      cadence: "monthly",
      is_recurring: true,
      execution_day: currentDayOfMonth,
      last_executed_at: null,
    },
  ];

  assert.equal(
    countPendingVerifications([], [], baseline as OperationalBaseline[]),
    3,
  );

  // If already executed today, should be 0
  const executedTodayBaseline = baseline.map((b) => ({
    ...b,
    last_executed_at: today.toISOString(),
  }));
  assert.equal(
    countPendingVerifications(
      [],
      [],
      executedTodayBaseline as OperationalBaseline[],
    ),
    0,
  );
});
