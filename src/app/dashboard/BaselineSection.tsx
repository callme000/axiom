"use client";

import { useState } from "react";
import { TAXONOMY_CATEGORIES } from "@/lib/finance/taxonomy";
import {
  createOperationalBaselineAction,
  type DashboardSnapshot,
} from "./actions";
import { OperationalBaseline, BaselineCadence } from "@/lib/analytics/types";
import { formatCurrency } from "@/lib/utils/formatters";
import { DistributionPieChart } from "@/components/dashboard/MiniCharts";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

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

  const chartData = baseline.map((b) => ({
    name: b.title,
    value: Number(b.amount),
  }));

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Maintenance",
    cadence: "monthly" as BaselineCadence,
    execution_day: 1,
    is_recurring: true,
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
        cadence: form.is_recurring ? form.cadence : "monthly", // Default or special irregular? Plan says use is_recurring logic.
        execution_day:
          form.is_recurring &&
          (form.cadence === "monthly" ||
            form.cadence === "weekly" ||
            form.cadence === "biweekly")
            ? Number(form.execution_day)
            : null,
        is_recurring: form.is_recurring,
        baseline_type: form.baseline_type,
        is_active: true,
        notes: form.notes || undefined,
      });
      setForm({
        title: "",
        amount: "",
        category: "Maintenance",
        cadence: "monthly",
        execution_day: 1,
        is_recurring: true,
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

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="font-cormorant text-2xl text-white tracking-wide uppercase">
          Operational Maintenance
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="font-mono text-[9px] tracking-[0.4em] uppercase text-white/40 hover:text-white transition-colors"
        >
          {isAdding ? "✕ CANCEL" : "+ APPEND RECURRING"}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white/2 border border-white/5 p-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                  Baseline Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rent, Netflix"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white font-light focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                  Amount
                </label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white font-light focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white/60 font-mono text-[10px] tracking-widest uppercase focus:outline-none"
                >
                  {TAXONOMY_CATEGORIES.map((cat) => (
                    <option
                      key={cat.value}
                      value={cat.value}
                      className="bg-black"
                    >
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.is_recurring}
                    onChange={(e) =>
                      setForm({ ...form, is_recurring: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-white/10 bg-transparent checked:bg-white transition-colors cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest group-hover:text-white/60 transition-colors">
                    Recurring Expense
                  </span>
                </label>

                {form.is_recurring && (
                  <div className="space-y-8 pt-4 animate-in fade-in slide-in-from-top-2 border-l border-white/5 pl-6 ml-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
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
                          className="w-full bg-transparent border-b border-white/10 py-3 text-white/60 font-mono text-[10px] tracking-widest uppercase focus:outline-none"
                        >
                          {CADENCES.map((c) => (
                            <option
                              key={c.value}
                              value={c.value}
                              className="bg-black"
                            >
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {form.cadence === "daily" && (
                        <div className="flex items-center pt-4">
                          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest leading-relaxed">
                            <span className="text-white/60">Note:</span> You
                            will be prompted everyday to verify this baseline.
                          </p>
                        </div>
                      )}

                      {(form.cadence === "monthly" ||
                        form.cadence === "weekly" ||
                        form.cadence === "biweekly") && (
                        <div className="space-y-2">
                          <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                            {form.cadence === "monthly"
                              ? "Day of Month (1-31)"
                              : "Day of Week"}
                          </label>
                          {form.cadence === "monthly" ? (
                            <input
                              type="number"
                              min="1"
                              max="31"
                              required
                              value={form.execution_day || ""}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  execution_day: Number(e.target.value),
                                })
                              }
                              className="w-full bg-transparent border-b border-white/10 py-3 text-white font-light focus:outline-none focus:border-white transition-colors"
                            />
                          ) : (
                            <select
                              value={form.execution_day || 1}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  execution_day: Number(e.target.value),
                                })
                              }
                              className="w-full bg-transparent border-b border-white/10 py-3 text-white/60 font-mono text-[10px] tracking-widest uppercase focus:outline-none"
                            >
                              {[
                                { label: "Monday", value: 1 },
                                { label: "Tuesday", value: 2 },
                                { label: "Wednesday", value: 3 },
                                { label: "Thursday", value: 4 },
                                { label: "Friday", value: 5 },
                                { label: "Saturday", value: 6 },
                                { label: "Sunday", value: 7 },
                              ].map((day) => (
                                <option
                                  key={day.value}
                                  value={day.value}
                                  className="bg-black"
                                >
                                  {day.label}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <p className="text-red-500 font-mono text-[9px] uppercase tracking-widest">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black py-4 font-medium tracking-[0.2em] uppercase text-[10px] hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? "SAVING..." : "CONFIRM RECURRING"}
            </button>
          </form>
        </div>
      )}

      {baseline.length > 0 && (
        <div className="py-6 border-b border-white/5 mb-6">
          <DistributionPieChart data={chartData} />
        </div>
      )}

      <div className="space-y-2">
        {baseline.length === 0 ? (
          <div className="py-12 text-center opacity-20">
            <p className="text-[10px] font-mono uppercase tracking-[0.5em]">
              No recurring flows active
            </p>
          </div>
        ) : (
          baseline.map((item, index) => (
            <ScrollReveal key={item.id} delay={index * 0.05} distance={10}>
              <div className="flex items-center justify-between py-6 border-b border-white/5 group hover:bg-white/1 transition-all px-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[8px] font-mono tracking-widest uppercase text-white/20">
                      {item.cadence}
                    </span>
                    {item.execution_day && (
                      <span className="text-[8px] font-mono tracking-widest uppercase text-white/10">
                        • Day {item.execution_day}
                      </span>
                    )}
                  </div>
                  <h3 className="font-cormorant text-xl text-white transition-transform group-hover:translate-x-2">
                    {item.title}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="font-cormorant text-xl text-white">
                    {formatCurrency(item.amount)}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))
        )}
      </div>
    </div>
  );
}
