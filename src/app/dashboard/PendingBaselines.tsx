"use client";

import { useState } from "react";
import type { OperationalBaseline, Account } from "@/lib/analytics/types";
import {
  resolvePendingBaselineAction,
  type DashboardSnapshot,
} from "./actions";
import { formatCurrency } from "@/lib/utils/formatters";

interface PendingBaselinesProps {
  baseline: OperationalBaseline[];
  accounts: Account[];
  onSnapshot: (snapshot: DashboardSnapshot) => void;
}

export function PendingBaselines({
  baseline,
  accounts,
  onSnapshot,
}: PendingBaselinesProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedAccounts, setSelectedAccounts] = useState<
    Record<string, string>
  >({});

  const today = new Date();
  const currentDayOfWeek = today.getDay() === 0 ? 7 : today.getDay();
  const currentDayOfMonth = today.getDate();

  const pendingBaselines = baseline.filter((b) => {
    if (!b.is_recurring) return false;

    // Check if already executed today
    if (b.last_executed_at) {
      const lastExecuted = new Date(b.last_executed_at);
      if (
        lastExecuted.getDate() === today.getDate() &&
        lastExecuted.getMonth() === today.getMonth() &&
        lastExecuted.getFullYear() === today.getFullYear()
      ) {
        return false;
      }
    }

    // Daily baselines are always pending if not executed today
    if (b.cadence === "daily") return true;

    if (b.execution_day) {
      if (b.cadence === "weekly") {
        return currentDayOfWeek === b.execution_day;
      }
      if (b.cadence === "monthly" || b.cadence === "biweekly") {
        return currentDayOfMonth === b.execution_day;
      }
    }

    return false;
  });

  if (pendingBaselines.length === 0) return null;

  async function handleVerify(item: OperationalBaseline) {
    const accountId = selectedAccounts[item.id];
    if (!accountId) {
      alert("Please select a source account.");
      return;
    }

    setLoadingId(item.id);
    try {
      const snapshot = await resolvePendingBaselineAction({
        baselineId: item.id,
        accountId,
        amount: item.amount,
        title: item.title,
      });
      onSnapshot(snapshot);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center gap-4">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
        <h2 className="text-[10px] font-mono text-white/60 uppercase tracking-[0.4em]">
          Baseline Verification Required
        </h2>
      </div>

      {pendingBaselines.map((item) => (
        <div
          key={item.id}
          className="bg-red-500/10 border border-red-500/20 p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8 text-white"
        >
          <div className="space-y-2">
            <p className="text-[10px] font-mono tracking-widest uppercase text-red-500/60">
              Structural Maintenance Prompt ({item.cadence})
            </p>
            <h3 className="font-cormorant text-4xl">
              {formatCurrency(item.amount)}
            </h3>
            <p className="text-xs font-light tracking-wide opacity-80">
              {item.title}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <select
              disabled={loadingId === item.id}
              value={selectedAccounts[item.id] || ""}
              onChange={(e) =>
                setSelectedAccounts({
                  ...selectedAccounts,
                  [item.id]: e.target.value,
                })
              }
              className="bg-transparent border-b border-white/40 py-2 font-mono text-[10px] tracking-widest uppercase focus:outline-none focus:border-white transition-colors min-w-50"
            >
              <option value="" className="text-black">
                Source Account
              </option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id} className="text-black">
                  {acc.account_name}
                </option>
              ))}
            </select>

            <button
              disabled={loadingId === item.id}
              onClick={() => handleVerify(item)}
              className="bg-white text-black px-10 py-4 font-medium tracking-widest uppercase text-[10px] hover:bg-white/90 transition-all disabled:opacity-50"
            >
              {loadingId === item.id ? "VERIFYING..." : "CONFIRM SETTLEMENT"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
