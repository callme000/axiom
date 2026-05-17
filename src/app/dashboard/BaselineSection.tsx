"use client";

import { useState } from "react";
import { TAXONOMY_CATEGORIES } from "@/lib/finance/taxonomy";
import {
  createOperationalBaselineAction,
  deleteOperationalBaselineAction,
  type DashboardSnapshot,
} from "./actions";
import { OperationalBaseline, BaselineCadence } from "@/lib/analytics/types";

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

export function BaselineSection({ baseline, onSnapshot }: BaselineSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Leakage",
    cadence: "monthly" as BaselineCadence,
    baseline_type: "expense" as "expense" | "allocation",
    notes: "",
  });

  const formatKSh = (amt: number) => {
    return `KSh ${Math.round(amt).toLocaleString()}`;
  };

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
        category: "Leakage",
        cadence: "monthly",
        baseline_type: "expense",
        notes: "",
      });
      setIsAdding(false);
      onSnapshot(snapshot);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create baseline entry");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this recurring flow? This will shift your baseline burn rate.")) return;
    setIsLoading(true);
    try {
      const snapshot = await deleteOperationalBaselineAction(id);
      onSnapshot(snapshot);
    } catch (err: unknown) {
      alert("Failed to delete entry");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-black text-foreground tracking-tight uppercase">
          Operational Baseline
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
        <div className="bg-background border-2 border-foreground rounded-3xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                  Designation
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rent, Crypto DCA"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                  Amount (KSh)
                </label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({ ...form, amount: e.target.value })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold appearance-none"
                >
                  {TAXONOMY_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                  Cadence
                </label>
                <select
                  value={form.cadence}
                  onChange={(e) =>
                    setForm({ ...form, cadence: e.target.value as BaselineCadence })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold appearance-none"
                >
                  {CADENCES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                  Flow Type
                </label>
                <select
                  value={form.baseline_type}
                  onChange={(e) =>
                    setForm({ ...form, baseline_type: e.target.value as "expense" | "allocation" })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold appearance-none"
                >
                  <option value="expense">Expense (Burn)</option>
                  <option value="allocation">Allocation (Investment)</option>
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
              {isLoading ? "CONFIGURING..." : "ESTABLISH BASELINE FLOW"}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {baseline.length === 0 ? (
          <div className="border-2 border-dashed border-foreground/10 rounded-3xl p-12 text-center group hover:border-foreground/20 transition-colors">
            <p className="text-foreground/60 text-xs font-bold uppercase tracking-widest">
              No structural flows defined.
            </p>
            <p className="text-foreground/40 text-[10px] mt-2 uppercase tracking-tight opacity-60">
              Define recurring expenses to track automatic burn.
            </p>
          </div>
        ) : (
          baseline.map((item) => (
            <div
              key={item.id}
              className="bg-foreground/5 border border-foreground/10 rounded-2xl p-5 group hover:bg-foreground/10 transition-all relative overflow-hidden"
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                      item.baseline_type === 'expense' ? 'bg-orange-500/20 text-orange-600' : 'bg-emerald-500/20 text-emerald-600'
                    }`}>
                      {item.baseline_type}
                    </span>
                    <span className="text-[9px] font-black text-background bg-foreground/30 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                      {item.cadence}
                    </span>
                    <h3 className="text-sm font-black text-foreground uppercase tracking-tight">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                    {item.category}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-black tabular-nums text-foreground">
                      {formatKSh(item.amount)}
                    </p>
                    <p className="text-[8px] font-black text-foreground/60 uppercase tracking-widest opacity-60">
                      Amount per {item.cadence.replace('ly', '')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-foreground/40 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
