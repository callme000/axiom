import { test } from "node:test";
import assert from "node:assert";
import { calculateStrategicAlignment } from "./engine";
import type { Deployment, StrategicObjective, Liability } from "./types";

test("strategic alignment funding ratios are deterministic", () => {
  const objectives: StrategicObjective[] = [
    {
      id: "obj1",
      user_id: "u1",
      objective_name: "Emergency Fund",
      objective_type: "emergency_reserve",
      target_amount: 1000,
      current_amount: 500,
      target_date: null,
      priority_level: "critical",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const alignment = calculateStrategicAlignment(objectives, [], 0, 0, 0, []);
  assert.strictEqual(alignment.fundingRatios["obj1"], 50);
});

test("alignment pressure scoring reflects structural conflict", () => {
  const objectives: StrategicObjective[] = [
    {
      id: "obj1",
      user_id: "u1",
      objective_name: "Liquidity",
      objective_type: "liquidity",
      target_amount: 1000,
      current_amount: 0,
      target_date: null,
      priority_level: "critical",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const deployments: Deployment[] = [
    {
      id: "d1",
      amount: 500,
      title: "Bad Spending",
      category: "Leakage",
      created_at: new Date().toISOString(),
    },
  ];

  const liabilities: Liability[] = [
    {
      id: "l1",
      user_id: "u1",
      liability_name: "Debt",
      liability_type: "personal_loan",
      outstanding_balance: 10000,
      created_at: "",
      updated_at: "",
      interest_rate: 0,
      minimum_payment: 0,
      due_date: null,
      currency: "KSh",
    },
  ];

  // Scenario: High Leakage, No Assets, Insufficient Liquidity, High Liabilities
  const alignment = calculateStrategicAlignment(
    objectives,
    deployments,
    1000,
    0,
    0,
    liabilities,
  );

  // Leakage > Assets (+25)
  // !isSufficient (+30) - totalCriticalTarget is 1000, liquidity is 1000. Wait, 1000 >= 1000 is true.
  // totalLiabilities (10000) > liquidity * 2 (2000) (+25)
  // Score should be at least 50.

  assert.ok(alignment.alignmentPressure >= 50);
});

test("liquidity sufficiency detects shortfalls", () => {
  const objectives: StrategicObjective[] = [
    {
      id: "obj1",
      user_id: "u1",
      objective_name: "Reserve",
      objective_type: "emergency_reserve",
      target_amount: 5000,
      current_amount: 1000,
      target_date: null,
      priority_level: "critical",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const alignment = calculateStrategicAlignment(objectives, [], 2000, 0, 0, []);

  assert.strictEqual(alignment.liquiditySufficiency.isSufficient, false);
  assert.strictEqual(alignment.liquiditySufficiency.shortfall, 2000); // 4000 remaining target - 2000 liquidity
});

test("objective starvation detection works for old stagnant goals", () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const objectives: StrategicObjective[] = [
    {
      id: "obj1",
      user_id: "u1",
      objective_name: "Starved Goal",
      objective_type: "investment",
      target_amount: 10000,
      current_amount: 100, // 1%
      target_date: null,
      priority_level: "high",
      status: "active",
      created_at: sixMonthsAgo.toISOString(),
      updated_at: sixMonthsAgo.toISOString(),
    },
  ];

  const alignment = calculateStrategicAlignment(objectives, [], 0, 0, 0, []);

  assert.ok(alignment.objectiveStarvationSignals.length > 0);
  assert.ok(alignment.objectiveStarvationSignals[0].includes("Starved Goal"));
});

test("strategic allocation awareness detects leakage conflict", () => {
  const objectives: StrategicObjective[] = [
    {
      id: "obj1",
      user_id: "u1",
      objective_name: "Build Cash",
      objective_type: "liquidity",
      target_amount: 1000,
      current_amount: 0,
      target_date: null,
      priority_level: "high",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const deployments: Deployment[] = [
    {
      id: "d1",
      amount: 1000,
      title: "Leakage",
      category: "Leakage",
      created_at: new Date().toISOString(),
    },
    {
      id: "d2",
      amount: 500,
      title: "Asset",
      category: "Asset",
      created_at: new Date().toISOString(),
    },
  ];

  const alignment = calculateStrategicAlignment(
    objectives,
    deployments,
    0,
    0,
    0,
    [],
  );

  assert.ok(alignment.strategicAllocationSignals.length > 0);
  assert.ok(
    alignment.strategicAllocationSignals[0].includes(
      "Leakage deployments exceeded Asset deployments",
    ),
  );
});
