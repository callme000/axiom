"use client";

import { useState } from "react";
import type { Liability, Account } from "@/lib/analytics/types";
import { resolvePendingLiabilityAction, type DashboardSnapshot } from "./actions";
import { formatCurrency } from "@/lib/utils/formatters";
import { LiabilityMap } from "@/lib/utils/taxonomy";

interface PendingLiabilitiesProps {
  liabilities: Liability[];
  accounts: Account[];
  onSnapshot: (snapshot: DashboardSnapshot) => void;
}

export function PendingLiabilities({
  liabilities,
  accounts,
  onSnapshot,
}: PendingLiabilitiesProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedAccounts, setSelectedAccounts] = useState<
    Record<string, string>
  >({});

  const today = new Date();
  const currentDayOfWeek = today.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
  const currentDayOfMonth = today.getDate();

  const pendingLiabilities = liabilities.filter((liab) => {
    if (!liab.is_paid_in_cadences || !liab.cadence_day_date) return false;

    // Check if already executed today
    if (liab.last_executed_at) {
      const lastExecuted = new Date(liab.last_executed_at);
      if (
        lastExecuted.getDate() === today.getDate() &&
        lastExecuted.getMonth() === today.getMonth() &&
        lastExecuted.getFullYear() === today.getFullYear()
      ) {
        return false;
      }
    }

    if (liab.cadence === "weekly") {
      return currentDayOfWeek === liab.cadence_day_date.toLowerCase();
    }
    if (liab.cadence === "monthly") {
      return currentDayOfMonth === parseInt(liab.cadence_day_date, 10);
    }

    return false;
  });

  if (pendingLiabilities.length === 0) return null;

  async function handleVerify(liab: Liability) {
    const accountId = selectedAccounts[liab.id];
    if (!accountId) {
      alert("Please select a source account.");
      return;
    }

    setLoadingId(liab.id);
    try {
      const snapshot = await resolvePendingLiabilityAction({
        liabilityId: liab.id,
        accountId,
        amount: liab.cadence_amount || 0,
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
          Payment Verification Required
        </h2>
      </div>

      {pendingLiabilities.map((liab) => (
        <div
          key={liab.id}
          className="bg-red-500 p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8 text-white"
        >
          <div className="space-y-2">
            <p className="text-[10px] font-mono tracking-widest uppercase opacity-60">
              Scheduled Obligation Detected
            </p>
            <h3 className="font-cormorant text-4xl">
              {formatCurrency(liab.cadence_amount || 0)}
            </h3>
            <p className="text-xs font-light tracking-wide opacity-80">
              {liab.liability_name} (
              {LiabilityMap[liab.liability_type] || liab.liability_type})
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <select
              disabled={loadingId === liab.id}
              value={selectedAccounts[liab.id] || ""}
              onChange={(e) =>
                setSelectedAccounts({
                  ...selectedAccounts,
                  [liab.id]: e.target.value,
                })
              }
              className="bg-transparent border-b border-white/40 py-2 font-mono text-[10px] tracking-widest uppercase focus:outline-none focus:border-white transition-colors min-w-[200px]"
            >
              <option value="" className="text-black">Source Account</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id} className="text-black">
                  {acc.account_name}
                </option>
              ))}
            </select>

            <button
              disabled={loadingId === liab.id}
              onClick={() => handleVerify(liab)}
              className="bg-white text-red-500 px-10 py-4 font-medium tracking-widest uppercase text-[10px] hover:bg-white/90 transition-all disabled:opacity-50"
            >
              {loadingId === liab.id ? "VERIFYING..." : "CONFIRM SETTLEMENT"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
