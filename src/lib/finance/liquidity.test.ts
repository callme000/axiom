import assert from "node:assert/strict";
import test from "node:test";
import { LiquidityService } from "./liquidity";
import { Account } from "@/lib/analytics/types";

test("LiquidityService.calculateTotal sums account balances correctly", () => {
  const accounts: Partial<Account>[] = [
    { current_balance: 1000 },
    { current_balance: 500 },
    { current_balance: 250.50 },
  ];

  assert.equal(LiquidityService.calculateTotal(accounts as Account[]), 1750.50);
});

test("LiquidityService.calculateTotal handles empty accounts list", () => {
  assert.equal(LiquidityService.calculateTotal([]), 0);
});

test("LiquidityService.calculateTotal handles zero and negative balances", () => {
  const accounts: Partial<Account>[] = [
    { current_balance: 1000 },
    { current_balance: -200 },
    { current_balance: 0 },
  ];

  assert.equal(LiquidityService.calculateTotal(accounts as Account[]), 800);
});

test("LiquidityService.calculateTotal handles missing balances", () => {
  const accounts: Partial<Account>[] = [
    { current_balance: 1000 },
    { } as Account,
  ];

  assert.equal(LiquidityService.calculateTotal(accounts as Account[]), 1000);
});
