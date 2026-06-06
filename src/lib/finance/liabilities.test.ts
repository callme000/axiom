import { test } from "node:test";
import assert from "node:assert";
import { validateLiability } from "./liabilities";
import { generateSummary } from "../analytics/engine";
import type { Account, Liability } from "../analytics/types";

test("liability validation enforces structural integrity", () => {
  const data = {
    liability_name: "Credit Card",
    liability_type: "credit_card",
    outstanding_balance: 50000,
    interest_rate: 2,
    is_paid_in_cadences: true,
    cadence: "monthly",
    cadence_day_date: "15",
    cadence_amount: 5000,
  };

  const validated = validateLiability(data);
  assert.strictEqual(validated.liability_name, "Credit Card");
  assert.strictEqual(validated.liability_type, "credit_card");
  assert.strictEqual(validated.outstanding_balance, 50000);
  assert.strictEqual(validated.is_paid_in_cadences, true);
  assert.strictEqual(validated.cadence, "monthly");
  assert.strictEqual(validated.cadence_day_date, "15");
  assert.strictEqual(validated.cadence_amount, 5000);
});

test("liability validation rejects invalid monthly date", () => {
  assert.throws(() => {
    validateLiability({
      liability_name: "Test",
      liability_type: "credit_card",
      outstanding_balance: 1000,
      is_paid_in_cadences: true,
      cadence: "monthly",
      cadence_day_date: "32",
      cadence_amount: 100,
    });
  }, /Monthly cadence requires a valid date/);
});

test("liability validation rejects invalid weekly day", () => {
  assert.throws(() => {
    validateLiability({
      liability_name: "Test",
      liability_type: "credit_card",
      outstanding_balance: 1000,
      is_paid_in_cadences: true,
      cadence: "weekly",
      cadence_day_date: "Funday",
      cadence_amount: 100,
    });
  }, /Weekly cadence requires a valid day/);
});

test("net worth calculation and interest accrual are deterministic", () => {
  const accounts: Account[] = [
    {
      id: "1",
      user_id: "u1",
      account_name: "Checking",
      account_type: "checking",
      current_balance: 100000,
      currency: "KSh",
      created_at: "",
      updated_at: "",
      institution: null,
    },
  ];

  const liabilities: Liability[] = [
    {
      id: "l1",
      user_id: "u1",
      liability_name: "Loan",
      liability_type: "personal_loan",
      outstanding_balance: 30000,
      interest_rate: 1, // 1% per month
      is_paid_in_cadences: true,
      cadence: "monthly",
      cadence_day_date: "1",
      cadence_amount: 3000,
      currency: "KSh",
      created_at: "",
      updated_at: "",
      institution: null,
      due_date: null,
    },
  ];

  const summary = generateSummary([], 100000, accounts, liabilities);

  assert.strictEqual(summary.totalAssets, 100000);
  assert.strictEqual(summary.totalLiabilities, 30000);
  assert.strictEqual(summary.netWorth, 70000);

  // Monthly interest = 30000 * 0.01 = 300
  // Daily interest burn = 300 / 30 = 10
  assert.strictEqual(summary.dailyBurnRate, 10);
});
