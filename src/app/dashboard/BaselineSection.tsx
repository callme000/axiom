"use client";

import { useState } from "react";
import { TAXONOMY_CATEGORIES } from "@/lib/finance/taxonomy";
import {
  createOperationalBaselineAction,
  deleteOperationalBaselineAction,
  type DashboardSnapshot,
} from "./actions";
import { OperationalBaseline, BaselineCadence } from "@/lib/analytics/types";
import { formatCurrency } from "@/lib/utils/formatters";
import { DeploymentMap } from "@/lib/utils/taxonomy";

interface BaselineSectionProps {
  baseline: OperationalBaseline[];
  onSnapshot: (snapshot: DashboardSnapshot) => void;
}

const CADENCES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

export function BaselineSection({
  baseline,
  onSnapshot,
}: BaselineSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Maintenance",
    cadence: "monthly" as BaselineCadence,
    baseline_type: "expense" as "expense" | "allocation",
    notes: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const snapshot = await createOperationalBaselineAction({
        title: form.title,
        amount: Number(form.amount),
        category: form.category,
        cadence: form.cadence,
        baseline_type: form.baseline_type,
        is_active: true,
        notes: form.notes || undefined,
      });
      setForm({
        title: "",
        amount: "",
        category: "Maintenance",
        cadence: "monthly",
        baseline_type: "expense",
        notes: "",
      });
      setIsAdding(false);
      onSnapshot(snapshot);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to create baseline entry",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (
      !confirm(
        "Archive this baseline entry? It will no longer influence active liquidity projections but will remain in historical telemetry.",
      )
    )
      return;
    setIsLoading(true);
    try {
      const snapshot = await deleteOperationalBaselineAction(id);
      onSnapshot(snapshot);
    } catch (err: unknown) {
      alert("Failed to archive entry");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-black text-foreground tracking-tight uppercase">
          Subscriptions
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-3 py-1.5 bg-foreground/5 hover:bg-foreground/10 rounded-xl transition-all group"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60 group-hover:text-foreground">
            {isAdding ? "Cancel" : "+ Add recurring"}
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
                  placeholder="e.g. Rent, Netflix"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-foreground/5 bg-foreground/[0.02] rounded-xl p-3 focus:outline-none focus:border-foreground/20 transition-colors text-foreground text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-1.5 block ml-1">
                  Amount
                </label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full border border-foreground/5 bg-foreground/[0.02] rounded-xl p-3 focus:outline-none focus:border-foreground/20 transition-colors text-foreground text-sm font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-1.5 block ml-1">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full border border-foreground/5 bg-foreground/[0.02] rounded-xl p-3 focus:outline-none focus:border-foreground/20 transition-colors text-foreground text-sm font-bold appearance-none"
                >
                  {TAXONOMY_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-1.5 block ml-1">
                  Frequency
                </label>
                <select
                  value={form.cadence}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      cadence: e.target.value as BaselineCadence,
                    })
                  }
                  className="w-full border border-foreground/5 bg-foreground/[0.02] rounded-xl p-3 focus:outline-none focus:border-foreground/20 transition-colors text-foreground text-sm font-bold appearance-none"
                >
                  {CADENCES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
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
              {isLoading ? "SAVING..." : "SAVE RECURRING"}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {baseline.length === 0 ? (
          <div className="border border-dashed border-foreground/10 rounded-2xl p-12 text-center">
            <p className="text-foreground/40 text-[10px] uppercase tracking-widest">
              No recurring flows.
            </p>
          </div>
        ) : (
          baseline.map((item) => (
            <div
              key={item.id}
              className="bg-foreground/[0.02] border border-foreground/5 rounded-2xl p-5 group hover:bg-foreground/[0.04] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-foreground/40 bg-foreground/5 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                      {item.cadence}
                    </span>
                    <h3 className="text-sm font-black text-foreground uppercase tracking-tight">
                      {item.title}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-black tabular-nums text-foreground">
                      {formatCurrency(item.amount)}
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
