"use client";

import { motion } from "framer-motion";
import { TAXONOMY_CATEGORIES } from "@/lib/finance/taxonomy";

export interface OnboardingBaseline {
  title: string;
  amount: string;
  cadence: string;
  execution_day: string;
  is_recurring: boolean;
  category: string;
}

const BASELINE_CADENCES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

interface ExpensesStepProps {
  baselines: OnboardingBaseline[];
  onChange: (baselines: OnboardingBaseline[]) => void;
}

export function ExpensesStep({ baselines, onChange }: ExpensesStepProps) {
  const addBaseline = () => {
    if (baselines.length < 3) {
      onChange([
        ...baselines,
        {
          title: "",
          amount: "",
          cadence: "monthly",
          execution_day: "1",
          is_recurring: true,
          category: "Maintenance",
        },
      ]);
    }
  };

  const removeBaseline = (index: number) => {
    onChange(baselines.filter((_, i) => i !== index));
  };

  const updateBaseline = (
    index: number,
    updates: Partial<OnboardingBaseline>,
  ) => {
    const next = [...baselines];
    next[index] = { ...next[index], ...updates };
    onChange(next);
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <h2 className="font-mono text-xs text-muted-foreground tracking-[0.4em] uppercase">
        Operational Baselines
      </h2>
      <div className="flex-1 space-y-6 md:space-y-4 overflow-y-auto scrollbar-hide pr-2">
        {baselines.map((base, idx) => (
          <div
            key={idx}
            className="space-y-4 md:space-y-3 pb-6 md:pb-3 border-b border-white/10 relative shrink-0"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <input
                type="text"
                placeholder="Baseline Name"
                value={base.title}
                onChange={(e) => updateBaseline(idx, { title: e.target.value })}
                className="bg-transparent border-b border-border py-1 font-mono text-sm uppercase tracking-widest text-foreground focus:outline-none placeholder:text-white/10"
              />
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-[0.4em]">
                  Category
                </label>
                <select
                  value={base.category}
                  onChange={(e) =>
                    updateBaseline(idx, { category: e.target.value })
                  }
                  className="bg-transparent border-b border-border py-1 text-[10px] font-mono tracking-widest uppercase text-muted-foreground/80 focus:outline-none w-full"
                >
                  {TAXONOMY_CATEGORIES.map((cat) => (
                    <option
                      key={cat.value}
                      value={cat.value}
                      className="bg-[#080808]"
                    >
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12">
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-[0.4em]">
                  Amount
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={base.amount}
                  onChange={(e) =>
                    updateBaseline(idx, { amount: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-border py-1 text-sm font-mono text-foreground focus:outline-none tabular-nums"
                />
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={base.is_recurring}
                  onChange={(e) =>
                    updateBaseline(idx, { is_recurring: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-border bg-transparent checked:bg-white transition-colors cursor-pointer"
                />
                <span className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-widest group-hover:text-muted-foreground/90 transition-colors">
                  Recurring Expense
                </span>
              </label>
              {base.is_recurring && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pt-2 pl-6 md:pl-8 border-l border-white/5"
                >
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-muted-foreground/60 uppercase">
                      Frequency
                    </label>
                    <select
                      value={base.cadence}
                      onChange={(e) =>
                        updateBaseline(idx, { cadence: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-border py-1 text-[10px] font-mono text-muted-foreground/90 focus:outline-none"
                    >
                      {BASELINE_CADENCES.map((c) => (
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

                  {base.cadence === "daily" && (
                    <div className="flex items-center pt-2">
                      <p className="text-[8px] font-mono text-muted-foreground/60 uppercase leading-tight">
                        Prompted everyday to verify.
                      </p>
                    </div>
                  )}

                  {(base.cadence === "monthly" ||
                    base.cadence === "weekly" ||
                    base.cadence === "biweekly") && (
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-muted-foreground/60 uppercase">
                        {base.cadence === "monthly" ? "Day" : "Day of Week"}
                      </label>
                      {base.cadence === "monthly" ? (
                        <input
                          type="number"
                          min="1"
                          max="31"
                          placeholder="15"
                          value={base.execution_day}
                          onChange={(e) =>
                            updateBaseline(idx, {
                              execution_day: e.target.value,
                            })
                          }
                          className="w-full bg-transparent border-b border-border py-1 text-[10px] font-mono text-muted-foreground/90 focus:outline-none"
                        />
                      ) : (
                        <select
                          value={base.execution_day || 1}
                          onChange={(e) =>
                            updateBaseline(idx, {
                              execution_day: e.target.value,
                            })
                          }
                          className="w-full bg-transparent border-b border-border py-1 text-[10px] font-mono text-muted-foreground/90 focus:outline-none"
                        >
                          {[
                            { label: "Mon", value: 1 },
                            { label: "Tue", value: 2 },
                            { label: "Wed", value: 3 },
                            { label: "Thu", value: 4 },
                            { label: "Fri", value: 5 },
                            { label: "Sat", value: 6 },
                            { label: "Sun", value: 7 },
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
                </motion.div>
              )}
            </div>
            {baselines.length > 1 && (
              <button
                type="button"
                onClick={() => removeBaseline(idx)}
                className="absolute top-0 right-0 p-2 text-muted-foreground/50 hover:text-red-400 bg-white/5 rounded-full hover:bg-white/10 transition-all"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addBaseline}
        className="text-[9px] font-mono tracking-[0.6em] uppercase text-muted-foreground/70 hover:text-foreground transition-all py-3 px-6 border border-border rounded-full self-start active:scale-95"
      >
        + Append Recurring
      </button>
    </div>
  );
}
