"use client";

import { useState } from "react";
import {
  INCOME_TYPES,
  CADENCES,
  type IncomeStream,
  type IncomeType,
  type Cadence,
} from "@/lib/finance/income";
import { createIncomeAction, type DashboardSnapshot } from "./actions";
import { formatCurrency } from "@/lib/utils/formatters";
import { IncomeMap } from "@/lib/utils/taxonomy";
import { DistributionPieChart } from "@/components/dashboard/MiniCharts";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface IncomeSectionProps {
  incomeStreams: IncomeStream[];
  onSnapshot: (snapshot: DashboardSnapshot) => void;
}

interface FormEntry {
  income_name: string;
  income_type: IncomeType;
  amount: string;
  cadence: Cadence;
  execution_day: number;
  is_recurring: boolean;
  source: string;
}

export function IncomeSection({
  incomeStreams,
  onSnapshot,
}: IncomeSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chartData = incomeStreams.map((s) => ({
    name: s.income_name,
    value: Number(s.amount),
  }));

  const [entries, setEntries] = useState<FormEntry[]>([
    {
      income_name: "",
      income_type: "salary",
      amount: "",
      cadence: "monthly",
      execution_day: 1,
      is_recurring: true,
      source: "",
    },
  ]);

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        income_name: "",
        income_type: "salary",
        amount: "",
        cadence: "monthly",
        execution_day: 1,
        is_recurring: true,
        source: "",
      },
    ]);
  };

  const updateEntry = <K extends keyof FormEntry>(
    index: number,
    field: K,
    value: FormEntry[K],
  ) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const snapshot = await createIncomeAction(
        entries.map((entry) => ({
          ...entry,
          amount: Number(entry.amount),
          cadence: entry.is_recurring ? entry.cadence : "irregular",
          execution_day:
            entry.is_recurring &&
            (entry.cadence === "monthly" ||
              entry.cadence === "weekly" ||
              entry.cadence === "biweekly")
              ? Number(entry.execution_day)
              : null,
          source: entry.source || undefined,
        })),
      );
      setEntries([
        {
          income_name: "",
          income_type: "salary",
          amount: "",
          cadence: "monthly",
          execution_day: 1,
          is_recurring: true,
          source: "",
        },
      ]);
      setIsAdding(false);
      onSnapshot(snapshot);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to record income streams",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="font-cormorant text-2xl text-white tracking-wide uppercase">
          Income Velocity
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="font-mono text-[9px] tracking-[0.4em] uppercase text-white/40 hover:text-white transition-colors"
        >
          {isAdding ? "✕ CANCEL" : "+ APPEND INCOME"}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white/2 border border-white/5 p-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <form onSubmit={handleSubmit} className="space-y-12">
            {entries.map((entry, index) => (
              <div key={index} className="space-y-8 relative">
                {index > 0 && <div className="border-t border-white/5 pt-8" />}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                      Source Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Salary"
                      value={entry.income_name}
                      onChange={(e) =>
                        updateEntry(index, "income_name", e.target.value)
                      }
                      className="w-full bg-transparent border-b border-white/10 py-3 text-white font-light focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                      Origin / Payer
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Corp"
                      value={entry.source}
                      onChange={(e) =>
                        updateEntry(index, "source", e.target.value)
                      }
                      className="w-full bg-transparent border-b border-white/10 py-3 text-white font-light focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                      Type
                    </label>
                    <select
                      value={entry.income_type}
                      onChange={(e) =>
                        updateEntry(
                          index,
                          "income_type",
                          e.target.value as IncomeType,
                        )
                      }
                      className="w-full bg-transparent border-b border-white/10 py-3 text-white/60 font-mono text-[10px] tracking-widest uppercase focus:outline-none"
                    >
                      {INCOME_TYPES.map((t) => (
                        <option
                          key={t.value}
                          value={t.value}
                          className="bg-black"
                        >
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                      Amount
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="0.00"
                      value={entry.amount}
                      onChange={(e) =>
                        updateEntry(index, "amount", e.target.value)
                      }
                      className="w-full bg-transparent border-b border-white/10 py-3 text-white font-light focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={entry.is_recurring}
                      onChange={(e) =>
                        updateEntry(index, "is_recurring", e.target.checked)
                      }
                      className="w-4 h-4 rounded border-white/10 bg-transparent checked:bg-white transition-colors cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest group-hover:text-white/60 transition-colors">
                      Recurring Inflow
                    </span>
                  </label>

                  {entry.is_recurring && (
                    <div className="space-y-8 pt-4 animate-in fade-in slide-in-from-top-2 border-l border-white/5 pl-6 ml-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                            Frequency
                          </label>
                          <select
                            value={entry.cadence}
                            onChange={(e) =>
                              updateEntry(
                                index,
                                "cadence",
                                e.target.value as Cadence,
                              )
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
                        {(entry.cadence === "monthly" ||
                          entry.cadence === "weekly" ||
                          entry.cadence === "biweekly") && (
                          <div className="space-y-2">
                            <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                              {entry.cadence === "monthly"
                                ? "Day of Month (1-31)"
                                : "Day of Week"}
                            </label>
                            {entry.cadence === "monthly" ? (
                              <input
                                type="number"
                                min="1"
                                max="31"
                                required
                                value={entry.execution_day || ""}
                                onChange={(e) =>
                                  updateEntry(
                                    index,
                                    "execution_day",
                                    Number(e.target.value),
                                  )
                                }
                                className="w-full bg-transparent border-b border-white/10 py-3 text-white font-light focus:outline-none focus:border-white transition-colors"
                              />
                            ) : (
                              <select
                                value={entry.execution_day || 1}
                                onChange={(e) =>
                                  updateEntry(
                                    index,
                                    "execution_day",
                                    Number(e.target.value),
                                  )
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
            ))}

            <div className="space-y-6">
              <button
                type="button"
                onClick={addEntry}
                className="text-[9px] font-mono tracking-widest uppercase text-white/20 hover:text-white transition-colors"
              >
                + APPEND ANOTHER SOURCE
              </button>

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
                {isLoading ? "SAVING..." : "CONFIRM INCOMES"}
              </button>
            </div>
          </form>
        </div>
      )}

      {incomeStreams.length > 0 && (
        <div className="py-6 border-b border-white/5 mb-6">
          <DistributionPieChart data={chartData} />
        </div>
      )}

      <div className="space-y-2">
        {incomeStreams.length === 0 ? (
          <div className="py-12 text-center opacity-20">
            <p className="text-[10px] font-mono uppercase tracking-[0.5em]">
              No income streams active
            </p>
          </div>
        ) : (
          incomeStreams.map((stream, index) => (
            <ScrollReveal key={stream.id} delay={index * 0.05} distance={10}>
              <div className="flex items-center justify-between py-6 border-b border-white/5 group hover:bg-white/1 transition-all px-2">
                <div className="space-y-1">
                  <span className="text-[8px] font-mono tracking-widest uppercase text-white/20">
                    {IncomeMap[stream.income_type] || stream.income_type}
                    {stream.source && ` • ${stream.source}`}
                  </span>
                  <h3 className="font-cormorant text-xl text-white transition-transform group-hover:translate-x-2">
                    {stream.income_name}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="font-cormorant text-xl text-white">
                    {formatCurrency(stream.amount)}
                    <span className="text-[10px] ml-2 text-white/20 font-sans tracking-widest uppercase">
                      / {stream.cadence}
                    </span>
                  </p>
                  {stream.execution_day && (
                    <p className="text-[8px] font-mono text-white/10 uppercase tracking-widest mt-1">
                      Executes on day {stream.execution_day}
                    </p>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))
        )}
      </div>
    </div>
  );
}
