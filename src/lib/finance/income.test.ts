import { test } from "node:test";
import assert from "node:assert";
import { validateIncomeStream, calculateMonthlyInflow } from "./income";
import { generateSummary } from "../analytics/engine";
import type { Deployment, IncomeStream } from "../analytics/types";

test("income validation enforces structural integrity", () => {
  const data = {
    income_name: "Salary",
    income_type: "salary",
    amount: 100000,
    cadence: "monthly",
  };

  const validated = validateIncomeStream(data);
  assert.strictEqual(validated.income_name, "Salary");
  assert.strictEqual(validated.income_type, "salary");
  assert.strictEqual(validated.amount, 100000);
  assert.strictEqual(validated.cadence, "monthly");
});

test("income normalization is accurate", () => {
  assert.strictEqual(
    calculateMonthlyInflow({ amount: 1000, cadence: "weekly" }),
    1000 * (52 / 12),
  );
  assert.strictEqual(
    calculateMonthlyInflow({ amount: 120000, cadence: "annually" }),
    10000,
  );
  assert.strictEqual(
    calculateMonthlyInflow({ amount: 5000, cadence: "monthly" }),
    5000,
  );
});

test("runway logic incorporates income offset correctly", () => {
  const deployments: Deployment[] = [
    {
      id: "1",
      amount: 3000,
      created_at: new Date().toISOString(),
      title: "Rent",
      category: "Fixed",
    },
  ]; // 100/day burn over 30 days

  const liquidity = 1000;
  const incomeStreams: IncomeStream[] = [
    {
      id: "s1",
      user_id: "u1",
      income_name: "Salary",
      amount: 1500,
      cadence: "monthly",
      is_recurring: true,
      income_type: "salary",
      currency: "KSh",
      start_date: "",
      created_at: "",
      updated_at: "",
    },
  ]; // 50/day offset

  // Formula: (Liquidity + Monthly Income) / Daily Burn
  // (1000 + 1500) / 100 = 25 days
  const summary = generateSummary(
    deployments,
    liquidity,
    [],
    [],
    incomeStreams,
  );

  assert.strictEqual(summary.dailyBurnRate, 100);
  assert.strictEqual(summary.totalMonthlyIncome, 1500);
  assert.strictEqual(summary.runwayDays, 25);
  assert.strictEqual(summary.adjustedDailyBurn, 50);
});
