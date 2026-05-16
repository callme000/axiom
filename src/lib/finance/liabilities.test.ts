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
  };

  const validated = validateLiability(data);
  assert.strictEqual(validated.liability_name, "Credit Card");
  assert.strictEqual(validated.liability_type, "credit_card");
  assert.strictEqual(validated.outstanding_balance, 50000);
});

test("liability validation rejects empty names", () => {
  assert.throws(() => {
    validateLiability({
      liability_name: "",
      liability_type: "credit_card",
      outstanding_balance: 1000,
    });
  }, /Liability name is required/);
});

test("liability validation rejects invalid types", () => {
  assert.throws(() => {
    validateLiability({
      liability_name: "Test",
      liability_type: "gambling_debt",
      outstanding_balance: 1000,
    });
  }, /Invalid liability type/);
});

test("net worth calculation is deterministic", () => {
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
      interest_rate: 0,
      minimum_payment: 0,
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
});
