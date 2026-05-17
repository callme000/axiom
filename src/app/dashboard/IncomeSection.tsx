"use client";

import { useState } from "react";
import { INCOME_TYPES, CADENCES, type IncomeStream } from "@/lib/finance/income";
import { calculateMonthlyInflow } from "@/lib/finance/income";
import {
  createIncomeAction,
  deleteIncomeAction,
  type DashboardSnapshot,
} from "./actions";

interface IncomeSectionProps {
  incomeStreams: IncomeStream[];
  onSnapshot: (snapshot: DashboardSnapshot) => void;
}

export function IncomeSection({
  incomeStreams,
  onSnapshot,
}: IncomeSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    income_name: "",
    income_type: "salary",
    amount: "",
    cadence: "monthly",
    is_recurring: true,
    source: "",
  });

  const formatKSh = (amt: number) => {
    return `KSh ${Math.round(amt).toLocaleString()}`;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const snapshot = await createIncomeAction({
        income_name: form.income_name,
        income_type: form.income_type,
        amount: Number(form.amount),
        cadence: form.cadence,
        is_recurring: form.is_recurring,
        source: form.source || undefined,
      });
      setForm({
        income_name: "",
        income_type: "salary",
        amount: "",
        cadence: "monthly",
        is_recurring: true,
        source: "",
      });
      setIsAdding(false);
      onSnapshot(snapshot);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to record income stream",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this replenishment source?")) return;
    setIsLoading(true);
    try {
      const snapshot = await deleteIncomeAction(id);
      onSnapshot(snapshot);
    } catch (err: unknown) {
      alert("Failed to delete income stream");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-black text-foreground tracking-tight uppercase">
          Capital Replenishment
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center text-background hover:scale-105 active:scale-95 transition-all"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          >
            <path d={isAdding ? "M18 12H6" : "M12 5v14M5 12h14"} />
          </svg>
        </button>
      </div>

      {isAdding && (
        <div className="bg-background border-2 border-foreground rounded-3xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                  Income Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Primary Salary"
                  value={form.income_name}
                  onChange={(e) =>
                    setForm({ ...form, income_name: e.target.value })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                  Amount (per cadence)
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
                  Type
                </label>
                <select
                  value={form.income_type}
                  onChange={(e) =>
                    setForm({ ...form, income_type: e.target.value })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold appearance-none"
                >
                  {INCOME_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
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
                    setForm({ ...form, cadence: e.target.value })
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
              <div className="flex flex-col justify-center pl-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.is_recurring}
                    onChange={(e) =>
                      setForm({ ...form, is_recurring: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-2 border-foreground accent-foreground"
                  />
                  <span className="text-[10px] font-black text-foreground/60 uppercase tracking-widest">
                    Recurring Inflow
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                Source (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Acme Corp"
                value={form.source}
                onChange={(e) =>
                  setForm({ ...form, source: e.target.value })
                }
                className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold"
              />
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
              {isLoading ? "ACKNOWLEDGING..." : "ACKNOWLEDGE REPLENISHMENT"}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {incomeStreams.length === 0 ? (
          <div className="border-2 border-dashed border-foreground/10 rounded-3xl p-12 text-center group hover:border-foreground/20 transition-colors">
            <p className="text-foreground/60 text-xs font-bold uppercase tracking-widest">
              No replenishment sources recorded.
            </p>
            <p className="text-foreground/40 text-[10px] mt-2 uppercase tracking-tight opacity-60">
              Inflow awareness layer currently at zero baseline.
            </p>
          </div>
        ) : (
          incomeStreams.map((stream) => (
            <div
              key={stream.id}
              className="bg-foreground/5 border border-foreground/10 rounded-2xl p-5 group hover:bg-foreground/10 transition-all relative overflow-hidden"
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-background bg-foreground/30 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                      {stream.income_type}
                    </span>
                    <h3 className="text-sm font-black text-foreground uppercase tracking-tight">
                      {stream.income_name}
                    </h3>
                  </div>
                  <div className="flex gap-3">
                    <p className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest">
                      {stream.cadence} • {stream.is_recurring ? "Recurring" : "One-off"}
                    </p>
                    {stream.source && (
                      <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">
                        Via {stream.source}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-black tabular-nums text-foreground">
                      {formatKSh(calculateMonthlyInflow(stream))}
                    </p>
                    <p className="text-[8px] font-black text-foreground/60 uppercase tracking-widest opacity-60">
                      Est. Monthly Inflow
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(stream.id)}
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
