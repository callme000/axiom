"use client";

import { motion } from "framer-motion";
import { LIABILITY_TYPES } from "@/lib/finance/liabilities";

export interface OnboardingLiability {
  liability_name: string;
  liability_type: string;
  outstanding_balance: string;
  interest_rate: string;
  institution: string;
  is_paid_in_cadences: boolean;
  cadence: string;
  cadence_day_date: string;
  cadence_amount: string;
}

interface LiabilitiesStepProps {
  liabilities: OnboardingLiability[];
  onChange: (liabilities: OnboardingLiability[]) => void;
}

export function LiabilitiesStep({
  liabilities,
  onChange,
}: LiabilitiesStepProps) {
  const addLiability = () => {
    if (liabilities.length < 2) {
      onChange([
        ...liabilities,
        {
          liability_name: "",
          liability_type: "credit_card",
          outstanding_balance: "",
          interest_rate: "0",
          institution: "",
          is_paid_in_cadences: false,
          cadence: "monthly",
          cadence_day_date: "1",
          cadence_amount: "",
        },
      ]);
    }
  };

  const removeLiability = (index: number) => {
    onChange(liabilities.filter((_, i) => i !== index));
  };

  const updateLiability = (
    index: number,
    updates: Partial<OnboardingLiability>,
  ) => {
    const next = [...liabilities];
    next[index] = { ...next[index], ...updates };
    onChange(next);
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <h2 className="font-mono text-xs text-muted-foreground tracking-[0.4em] uppercase">
        Financial Commitments
      </h2>
      <div className="flex-1 space-y-6 md:space-y-4 overflow-y-auto scrollbar-hide pr-2">
        {liabilities.map((liab, idx) => (
          <div
            key={idx}
            className="space-y-4 md:space-y-3 pb-6 md:pb-3 border-b border-white/10 relative shrink-0"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <input
                type="text"
                placeholder="Obligation Name"
                value={liab.liability_name}
                onChange={(e) =>
                  updateLiability(idx, { liability_name: e.target.value })
                }
                className="bg-transparent border-b border-border py-1 font-mono text-sm uppercase tracking-widest text-foreground focus:outline-none placeholder:text-white/10"
              />
              <input
                type="text"
                placeholder="Financial Institution"
                value={liab.institution}
                onChange={(e) =>
                  updateLiability(idx, { institution: e.target.value })
                }
                className="bg-transparent border-b border-border py-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 focus:outline-none placeholder:text-white/10"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-[0.4em]">
                  Type
                </label>
                <select
                  value={liab.liability_type}
                  onChange={(e) =>
                    updateLiability(idx, { liability_type: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-border py-1 text-[10px] font-mono tracking-widest uppercase text-muted-foreground/80 focus:outline-none"
                >
                  {LIABILITY_TYPES.map((t) => (
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
              <div className="grid grid-cols-2 gap-4 md:col-span-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-[0.4em]">
                    Balance
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={liab.outstanding_balance}
                    onChange={(e) =>
                      updateLiability(idx, {
                        outstanding_balance: e.target.value,
                      })
                    }
                    className="w-full bg-transparent border-b border-border py-1 text-sm font-mono text-foreground focus:outline-none tabular-nums"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-[0.4em]">
                    Interest %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={liab.interest_rate}
                    onChange={(e) =>
                      updateLiability(idx, { interest_rate: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-border py-1 text-sm font-mono text-foreground focus:outline-none tabular-nums"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={liab.is_paid_in_cadences}
                  onChange={(e) =>
                    updateLiability(idx, {
                      is_paid_in_cadences: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-border bg-transparent checked:bg-white transition-colors cursor-pointer"
                />
                <span className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-widest group-hover:text-muted-foreground/90 transition-colors">
                  Paid in Cadence
                </span>
              </label>
              {liab.is_paid_in_cadences && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pt-2 pl-6 md:pl-8 border-l border-white/5"
                >
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-muted-foreground/60 uppercase">
                      Cadence
                    </label>
                    <select
                      value={liab.cadence}
                      onChange={(e) =>
                        updateLiability(idx, { cadence: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-border py-1 text-[10px] font-mono text-muted-foreground/90 focus:outline-none"
                    >
                      <option value="weekly" className="bg-black">
                        Weekly
                      </option>
                      <option value="monthly" className="bg-black">
                        Monthly
                      </option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:col-span-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-muted-foreground/60 uppercase">
                        {liab.cadence === "weekly" ? "Day" : "Day"}
                      </label>
                      {liab.cadence === "monthly" ? (
                        <input
                          type="number"
                          min="1"
                          max="31"
                          placeholder="15"
                          value={liab.cadence_day_date}
                          onChange={(e) =>
                            updateLiability(idx, {
                              cadence_day_date: e.target.value,
                            })
                          }
                          className="w-full bg-transparent border-b border-border py-1 text-[10px] font-mono text-muted-foreground/90 focus:outline-none"
                        />
                      ) : (
                        <select
                          value={liab.cadence_day_date || "Monday"}
                          onChange={(e) =>
                            updateLiability(idx, {
                              cadence_day_date: e.target.value,
                            })
                          }
                          className="w-full bg-transparent border-b border-border py-1 text-[10px] font-mono text-muted-foreground/90 focus:outline-none"
                        >
                          {[
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                            "Sunday",
                          ].map((day) => (
                            <option key={day} value={day} className="bg-black">
                              {day.slice(0, 3)}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-muted-foreground/60 uppercase">
                        Payment
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={liab.cadence_amount}
                        onChange={(e) =>
                          updateLiability(idx, {
                            cadence_amount: e.target.value,
                          })
                        }
                        className="w-full bg-transparent border-b border-border py-1 text-[10px] font-mono text-muted-foreground/90 focus:outline-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <button
              type="button"
              onClick={() => removeLiability(idx)}
              className="absolute top-0 right-0 p-2 text-muted-foreground/50 hover:text-red-400 bg-white/5 rounded-full hover:bg-white/10 transition-all"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addLiability}
        className="text-[11px] font-mono tracking-[0.6em] uppercase text-muted-foreground/70 hover:text-foreground transition-all py-4 px-8 border border-border rounded-full self-start active:scale-95"
      >
        + Append Obligation
      </button>
    </div>
  );
}
