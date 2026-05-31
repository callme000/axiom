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
  const [selectedAccounts, setSelectedAccounts] = useState<Record<string, string>>({});

  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
  const currentDayOfMonth = today.getDate();

  // Map JS getDay (0-6) to our 1-7 (Mon-Sun) if necessary
  // Standard getDay: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  // Our Weekly selection used 1=Mon, ..., 7=Sun
  const mappedDayOfWeek = currentDayOfWeek === 0 ? 7 : currentDayOfWeek;

  const pendingInflows = incomeStreams.filter((stream) => {
    if (!stream.is_recurring || !stream.execution_day) return false;

    // Check if last_executed_at is today
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
    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="h-0.5 w-8 bg-orange-500/20"></div>
        <h2 className="text-[10px] font-black text-orange-500/60 uppercase tracking-[0.3em]">
          Verification Required
        </h2>
      </div>

      {pendingInflows.map((stream) => (
        <div
          key={stream.id}
          className="bg-background border-2 border-foreground rounded-2xl p-4 md:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-foreground text-background rounded-xl flex items-center justify-center shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-0.5">
                [PENDING INFLOW]
              </p>
              <h3 className="text-sm font-black text-foreground uppercase tracking-tight">
                {formatCurrency(stream.amount)} / {IncomeMap[stream.income_type] || stream.income_type} / {stream.income_name}
              </h3>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              disabled={loadingId === stream.id}
              value={selectedAccounts[stream.id] || ""}
              onChange={(e) =>
                setSelectedAccounts({
                  ...selectedAccounts,
                  [stream.id]: e.target.value,
                })
              }
              className="border-2 border-foreground/10 bg-background rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-foreground transition-colors appearance-none min-w-[180px]"
            >
              <option value="">Select Account</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.account_name}
                </option>
              ))}
            </select>

            <button
              disabled={loadingId === stream.id}
              onClick={() => handleVerify(stream)}
              className="bg-foreground text-background px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-foreground/90 transition-all disabled:opacity-50 shrink-0"
            >
              {loadingId === stream.id ? "VERIFYING..." : "Verify & Clear"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
