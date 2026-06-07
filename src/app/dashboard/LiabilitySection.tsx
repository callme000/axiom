"use client";

import { useState } from "react";
import { LIABILITY_TYPES, type Liability } from "@/lib/finance/liabilities";
import { createLiabilityAction, type DashboardSnapshot } from "./actions";
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
    is_paid_in_cadences: false,
    cadence: "monthly",
    cadence_day_date: "",
    cadence_amount: "",
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
        is_paid_in_cadences: form.is_paid_in_cadences,
        cadence: form.is_paid_in_cadences ? form.cadence : null,
        cadence_day_date: form.is_paid_in_cadences
          ? form.cadence_day_date
          : null,
        cadence_amount: form.is_paid_in_cadences
          ? Number(form.cadence_amount)
          : null,
        institution: form.institution || undefined,
      });
      setForm({
        liability_name: "",
        liability_type: "credit_card",
        outstanding_balance: "",
        interest_rate: "",
        is_paid_in_cadences: false,
        cadence: "monthly",
        cadence_day_date: "",
        cadence_amount: "",
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

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="font-cormorant text-2xl text-white tracking-wide uppercase">
          Financial Commitments
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="font-mono text-[9px] tracking-[0.4em] uppercase text-white/40 hover:text-white transition-colors"
        >
          {isAdding ? "✕ CANCEL" : "+ APPEND COMMITMENT"}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white/2 border border-white/5 p-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                  Commitment Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Equity Bank Loan"
                  value={form.liability_name}
                  onChange={(e) =>
                    setForm({ ...form, liability_name: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white font-light focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                  Outstanding Balance
                </label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={form.outstanding_balance}
                  onChange={(e) =>
                    setForm({ ...form, outstanding_balance: e.target.value })
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
                  value={form.liability_type}
                  onChange={(e) =>
                    setForm({ ...form, liability_type: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white/60 font-mono text-[10px] tracking-widest uppercase focus:outline-none"
                >
                  {LIABILITY_TYPES.map((t) => (
                    <option key={t.value} value={t.value} className="bg-black">
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                  Interest (% per cadence)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={form.interest_rate}
                  onChange={(e) =>
                    setForm({ ...form, interest_rate: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white font-light focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.is_paid_in_cadences}
                  onChange={(e) =>
                    setForm({ ...form, is_paid_in_cadences: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-white/10 bg-transparent checked:bg-white transition-colors cursor-pointer"
                />
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest group-hover:text-white/60 transition-colors">
                  Paid in Cadences
                </span>
              </label>

              {form.is_paid_in_cadences && (
                <div className="space-y-8 pt-4 animate-in fade-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                        Cadence
                      </label>
                      <select
                        value={form.cadence}
                        onChange={(e) =>
                          setForm({ ...form, cadence: e.target.value })
                        }
                        className="w-full bg-transparent border-b border-white/10 py-3 text-white/60 font-mono text-[10px] tracking-widest uppercase focus:outline-none"
                      >
                        <option value="weekly" className="bg-black">
                          Weekly
                        </option>
                        <option value="monthly" className="bg-black">
                          Monthly
                        </option>
                      </select>
                    </div>
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
                          placeholder="e.g. 15"
                          value={form.cadence_day_date}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              cadence_day_date: e.target.value,
                            })
                          }
                          className="w-full bg-transparent border-b border-white/10 py-3 text-white font-light focus:outline-none focus:border-white transition-colors"
                        />
                      ) : (
                        <select
                          value={form.cadence_day_date}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              cadence_day_date: e.target.value,
                            })
                          }
                          className="w-full bg-transparent border-b border-white/10 py-3 text-white/60 font-mono text-[10px] tracking-widest uppercase focus:outline-none"
                        >
                          <option value="" className="bg-black">
                            Select Day
                          </option>
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
                              {day}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                      Payment Amount per Cadence
                    </label>
                    <input
                      type="number"
                      required={form.is_paid_in_cadences}
                      placeholder="0.00"
                      value={form.cadence_amount}
                      onChange={(e) =>
                        setForm({ ...form, cadence_amount: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-white/10 py-3 text-white font-light focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>
              )}
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
              {isLoading ? "INITIALIZING..." : "CONFIRM COMMITMENT"}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-2">
        {liabilities.length === 0 ? (
          <div className="py-12 text-center opacity-20">
            <p className="text-[10px] font-mono uppercase tracking-[0.5em]">
              No active commitments
            </p>
          </div>
        ) : (
          liabilities.map((liability) => (
            <div
              key={liability.id}
              className="flex items-center justify-between py-6 border-b border-white/5 group hover:bg-white/1 transition-all px-2"
            >
              <div className="space-y-1">
                <span className="text-[8px] font-mono tracking-widest uppercase text-white/20">
                  {LiabilityMap[liability.liability_type] ||
                    liability.liability_type}
                  {liability.is_paid_in_cadences && (
                    <span className="ml-2 text-white/10">
                      • {liability.cadence} ({liability.cadence_day_date})
                    </span>
                  )}
                </span>
                <h3 className="font-cormorant text-xl text-white transition-transform group-hover:translate-x-2">
                  {liability.liability_name}
                </h3>
              </div>
              <div className="text-right">
                <p className="font-cormorant text-xl text-white">
                  {formatCurrency(liability.outstanding_balance)}
                </p>
                {liability.interest_rate > 0 && (
                  <p className="text-[8px] font-mono text-red-500/40 uppercase tracking-widest mt-1">
                    {liability.interest_rate}% Per Cadence
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
