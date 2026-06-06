"use client";

import { useState } from "react";
import type { IncomeStream, Account } from "@/lib/analytics/types";
import { resolvePendingInflowAction, type DashboardSnapshot } from "./actions";
import { formatCurrency } from "@/lib/utils/formatters";
import { IncomeMap } from "@/lib/utils/taxonomy";

interface PendingInflowsProps {
  incomeStreams: IncomeStream[];
  accounts: Account[];
  onSnapshot: (snapshot: DashboardSnapshot) => void;
}

export function PendingInflows({
  incomeStreams,
  accounts,
  onSnapshot,
}: PendingInflowsProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedAccounts, setSelectedAccounts] = useState<
    Record<string, string>
  >({});

  const today = new Date();
  const currentDayOfWeek = today.getDay();
  const currentDayOfMonth = today.getDate();
  const mappedDayOfWeek = currentDayOfWeek === 0 ? 7 : currentDayOfWeek;

  const pendingInflows = incomeStreams.filter((stream) => {
    if (!stream.is_recurring || !stream.execution_day) return false;

    if (stream.last_executed_at) {
      const lastExecuted = new Date(stream.last_executed_at);
      if (
        lastExecuted.getDate() === today.getDate() &&
        lastExecuted.getMonth() === today.getMonth() &&
        lastExecuted.getFullYear() === today.getFullYear()
      ) {
        return false;
      }
    }

    if (stream.cadence === "weekly") {
      return mappedDayOfWeek === stream.execution_day;
    }
    if (stream.cadence === "monthly" || stream.cadence === "biweekly") {
      return currentDayOfMonth === stream.execution_day;
    }

    return false;
  });

  if (pendingInflows.length === 0) return null;

  async function handleVerify(stream: IncomeStream) {
    const accountId = selectedAccounts[stream.id];
    if (!accountId) {
      alert("Please select a destination account.");
      return;
    }

    setLoadingId(stream.id);
    try {
      const snapshot = await resolvePendingInflowAction({
        incomeId: stream.id,
        accountId,
        amount: stream.amount,
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
        <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
        <h2 className="text-[10px] font-mono text-white/60 uppercase tracking-[0.4em]">
          Verification Required
        </h2>
      </div>

      {pendingInflows.map((stream) => (
        <div
          key={stream.id}
          className="bg-white p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8 text-black"
        >
          <div className="space-y-2">
            <p className="text-[10px] font-mono tracking-widest uppercase opacity-40">
              Expected Income Detected
            </p>
            <h3 className="font-cormorant text-4xl">
              {formatCurrency(stream.amount)}
            </h3>
            <p className="text-xs font-light tracking-wide opacity-60">
              {stream.income_name} (
              {IncomeMap[stream.income_type] || stream.income_type})
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <select
              disabled={loadingId === stream.id}
              value={selectedAccounts[stream.id] || ""}
              onChange={(e) =>
                setSelectedAccounts({
                  ...selectedAccounts,
                  [stream.id]: e.target.value,
                })
              }
              className="bg-transparent border-b border-black/20 py-2 font-mono text-[10px] tracking-widest uppercase focus:outline-none focus:border-black transition-colors min-w-[200px]"
            >
              <option value="">Destination Account</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.account_name}
                </option>
              ))}
            </select>

            <button
              disabled={loadingId === stream.id}
              onClick={() => handleVerify(stream)}
              className="bg-black text-white px-10 py-4 font-medium tracking-widest uppercase text-[10px] hover:bg-black/90 transition-all disabled:opacity-50"
            >
              {loadingId === stream.id ? "VERIFYING..." : "CONFIRM RECEIPT"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
