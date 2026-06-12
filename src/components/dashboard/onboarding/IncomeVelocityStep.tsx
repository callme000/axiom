"use client";

import { motion } from "framer-motion";
import { INCOME_TYPES, CADENCES } from "@/lib/finance/income";

export interface OnboardingIncome {
  income_name: string;
  income_type: string;
  amount: string;
  cadence: string;
  execution_day: string;
  is_recurring: boolean;
  source: string;
}

interface IncomeVelocityStepProps {
  incomes: OnboardingIncome[];
  onChange: (incomes: OnboardingIncome[]) => void;
}

export function IncomeVelocityStep({
  incomes,
  onChange,
}: IncomeVelocityStepProps) {
  const addIncome = () => {
    if (incomes.length < 3) {
      onChange([
        ...incomes,
        {
          income_name: "",
          income_type: "salary",
          amount: "",
          cadence: "monthly",
          execution_day: "1",
          is_recurring: true,
          source: "",
        },
      ]);
    }
  };

  const removeIncome = (index: number) => {
    onChange(incomes.filter((_, i) => i !== index));
  };

  const updateIncome = (index: number, updates: Partial<OnboardingIncome>) => {
    const next = [...incomes];
    next[index] = { ...next[index], ...updates };
    onChange(next);
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <h2 className="font-mono text-xs text-muted-foreground tracking-[0.4em] uppercase">
        Income Velocity
      </h2>
      <div className="flex-1 space-y-6 md:space-y-4 overflow-y-auto scrollbar-hide pr-2">
        {incomes.map((inc, idx) => (
          <div
            key={idx}
            className="space-y-4 md:space-y-3 pb-6 md:pb-3 border-b border-white/10 relative shrink-0"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <input
                type="text"
                placeholder="Income Name"
                value={inc.income_name}
                onChange={(e) =>
                  updateIncome(idx, { income_name: e.target.value })
                }
                className="bg-transparent border-b border-border py-1 font-mono text-sm uppercase tracking-widest text-foreground focus:outline-none placeholder:text-white/10"
              />
              <input
                type="text"
                placeholder="Origin"
                value={inc.source}
                onChange={(e) => updateIncome(idx, { source: e.target.value })}
                className="bg-transparent border-b border-border py-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 focus:outline-none placeholder:text-white/10"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-[0.4em]">
                  Type
                </label>
                <select
                  value={inc.income_type}
                  onChange={(e) =>
                    updateIncome(idx, { income_type: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-border py-1 text-[10px] font-mono tracking-widest uppercase text-muted-foreground/80 focus:outline-none"
                >
                  {INCOME_TYPES.map((t) => (
                    <option
                      key={t.value}
                      value={t.value}
                      className="bg-[#080808]"
                    >
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-[0.4em]">
                  Amount
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={inc.amount}
                  onChange={(e) =>
                    updateIncome(idx, { amount: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-border py-1 text-sm font-mono text-foreground focus:outline-none tabular-nums"
                />
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={inc.is_recurring}
                  onChange={(e) =>
                    updateIncome(idx, { is_recurring: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-border bg-transparent checked:bg-white transition-colors cursor-pointer"
                />
                <span className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-widest group-hover:text-muted-foreground/90 transition-colors">
                  Recurring Income
                </span>
              </label>
              {inc.is_recurring && (
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
                      value={inc.cadence}
                      onChange={(e) =>
                        updateIncome(idx, { cadence: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-border py-1 text-[10px] font-mono text-muted-foreground/90 focus:outline-none"
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

                  {(inc.cadence === "monthly" ||
                    inc.cadence === "weekly" ||
                    inc.cadence === "biweekly") && (
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-muted-foreground/60 uppercase">
                        {inc.cadence === "monthly" ? "Day" : "Day of Week"}
                      </label>
                      {inc.cadence === "monthly" ? (
                        <input
                          type="number"
                          min="1"
                          max="31"
                          placeholder="15"
                          value={inc.execution_day}
                          onChange={(e) =>
                            updateIncome(idx, { execution_day: e.target.value })
                          }
                          className="w-full bg-transparent border-b border-border py-1 text-[10px] font-mono text-muted-foreground/90 focus:outline-none"
                        />
                      ) : (
                        <select
                          value={inc.execution_day || 1}
                          onChange={(e) =>
                            updateIncome(idx, { execution_day: e.target.value })
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
            <button
              type="button"
              onClick={() => removeIncome(idx)}
              className="absolute top-0 right-0 p-2 text-muted-foreground/50 hover:text-red-400 bg-white/5 rounded-full hover:bg-white/10 transition-all"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addIncome}
        className="text-[9px] font-mono tracking-[0.6em] uppercase text-muted-foreground/70 hover:text-foreground transition-all py-3 px-6 border border-border rounded-full self-start active:scale-95"
      >
        + Append Income
      </button>
    </div>
  );
}
