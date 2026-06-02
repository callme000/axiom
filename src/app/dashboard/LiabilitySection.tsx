"use client";

import { useState } from "react";
import { LIABILITY_TYPES, type Liability } from "@/lib/finance/liabilities";
import {
  createLiabilityAction,
  deleteLiabilityAction,
  type DashboardSnapshot,
} from "./actions";
import { formatCurrency } from "@/lib/utils/formatters";
import { LiabilityMap } from "@/lib/utils/taxonomy";

interface LiabilitySectionProps {
  liabilities: Liability[];
  onSnapshot: (snapshot: DashboardSnapshot) => void;
}

export function LiabilitySection({
  liabilities,
  onSnapshot,
}: LiabilitySectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    liability_name: "",
    liability_type: "credit_card",
    outstanding_balance: "",
    interest_rate: "",
    minimum_payment: "",
    institution: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const snapshot = await createLiabilityAction({
        liability_name: form.liability_name,
        liability_type: form.liability_type,
        outstanding_balance: Number(form.outstanding_balance),
        interest_rate: form.interest_rate ? Number(form.interest_rate) : 0,
        minimum_payment: form.minimum_payment
          ? Number(form.minimum_payment)
          : 0,
        institution: form.institution || undefined,
      });
      setForm({
        liability_name: "",
        liability_type: "credit_card",
        outstanding_balance: "",
        interest_rate: "",
        minimum_payment: "",
        institution: "",
      });
      setIsAdding(false);
      onSnapshot(snapshot);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to record obligation",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (
      !confirm(
        "Archive this obligation? If it has been settled, this will preserve the resolution record.",
      )
    )
      return;
    setIsLoading(true);
    try {
      const snapshot = await deleteLiabilityAction(id);
      onSnapshot(snapshot);
    } catch {
      alert("Failed to archive obligation");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-black text-foreground tracking-tight uppercase">
          Commitments
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-3 py-1.5 bg-foreground/5 hover:bg-foreground/10 rounded-xl transition-all group"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60 group-hover:text-foreground">
            {isAdding ? "Cancel" : "+ Add commitment"}
          </span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-background border border-foreground/10 rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-1.5 block ml-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Equity Bank Loan"
                  value={form.liability_name}
                  onChange={(e) =>
                    setForm({ ...form, liability_name: e.target.value })
                  }
                  className="w-full border border-foreground/5 bg-foreground/[0.02] rounded-xl p-3 focus:outline-none focus:border-foreground/20 transition-colors text-foreground text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-1.5 block ml-1">
                  Balance (KSh)
                </label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={form.outstanding_balance}
                  onChange={(e) =>
                    setForm({ ...form, outstanding_balance: e.target.value })
                  }
                  className="w-full border border-foreground/5 bg-foreground/[0.02] rounded-xl p-3 focus:outline-none focus:border-foreground/20 transition-colors text-foreground text-sm font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-1.5 block ml-1">
                  Type
                </label>
                <select
                  value={form.liability_type}
                  onChange={(e) =>
                    setForm({ ...form, liability_type: e.target.value })
                  }
                  className="w-full border border-foreground/5 bg-foreground/[0.02] rounded-xl p-3 focus:outline-none focus:border-foreground/20 transition-colors text-foreground text-sm font-bold appearance-none"
                >
                  {LIABILITY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-1.5 block ml-1">
                  Min. Payment
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.minimum_payment}
                  onChange={(e) =>
                    setForm({ ...form, minimum_payment: e.target.value })
                  }
                  className="w-full border border-foreground/5 bg-foreground/[0.02] rounded-xl p-3 focus:outline-none focus:border-foreground/20 transition-colors text-foreground text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-1.5 block ml-1">
                  Interest (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={form.interest_rate}
                  onChange={(e) =>
                    setForm({ ...form, interest_rate: e.target.value })
                  }
                  className="w-full border border-foreground/5 bg-foreground/[0.02] rounded-xl p-3 focus:outline-none focus:border-foreground/20 transition-colors text-foreground text-sm font-bold"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-[10px] font-black uppercase tracking-tight ml-1">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-foreground text-background py-3 rounded-xl font-black uppercase tracking-widest hover:bg-foreground/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? "SAVING..." : "LOG COMMITMENT"}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {liabilities.length === 0 ? (
          <div className="border border-dashed border-foreground/10 rounded-2xl p-12 text-center">
            <p className="text-foreground/40 text-[10px] uppercase tracking-widest">
              No active commitments.
            </p>
          </div>
        ) : (
          liabilities.map((liability) => (
            <div
              key={liability.id}
              className="bg-foreground/[0.02] border border-foreground/5 rounded-2xl p-5 group hover:bg-foreground/[0.04] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-foreground/40 bg-foreground/5 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                      {LiabilityMap[liability.liability_type] ||
                        liability.liability_type}
                    </span>
                    <h3 className="text-sm font-black text-foreground uppercase tracking-tight">
                      {liability.liability_name}
                    </h3>
                  </div>
                  <div className="flex gap-3">
                    {liability.interest_rate > 0 && (
                      <p className="text-[10px] font-black text-red-500/40 uppercase tracking-widest">
                        {liability.interest_rate}% APR
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-black tabular-nums text-foreground">
                      {formatCurrency(liability.outstanding_balance)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
