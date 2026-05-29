"use client";

import { useState } from "react";
import {
  submitDayZeroBaselineAction,
  type DashboardSnapshot,
} from "@/app/dashboard/actions";
import { formatCurrency } from "@/lib/utils/formatters";

interface DayZeroOnboardingProps {
  onComplete: (snapshot: DashboardSnapshot) => void;
}

const ACCOUNT_TYPES = [
  { value: "mobile_money", label: "Mobile Money (M-Pesa)" },
  { value: "checking", label: "Checking / Current Account" },
  { value: "savings", label: "Savings Account" },
  { value: "cash", label: "Cash on Hand" },
  { value: "crypto", label: "Digital Assets / Crypto" },
];

const INCOME_TYPES = [
  { value: "salary", label: "Salary" },
  { value: "freelance", label: "Freelance / Gig" },
  { value: "business", label: "Business Profits" },
  { value: "other", label: "Other Inflow" },
];

const CADENCES = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "annually", label: "Annually" },
];

const BASELINE_CADENCES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export default function DayZeroOnboarding({
  onComplete,
}: DayZeroOnboardingProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [accounts, setAccounts] = useState([
    {
      account_name: "Primary M-Pesa",
      account_type: "mobile_money",
      current_balance: "",
    },
  ]);
  const [incomes, setIncomes] = useState([
    {
      income_name: "Primary Inflow",
      income_type: "salary",
      amount: "",
      cadence: "monthly",
    },
  ]);
  const [liabilities, setLiabilities] = useState([
    {
      liability_name: "Fuliza / Digital Loan",
      liability_type: "personal_loan",
      outstanding_balance: "",
    },
  ]);
  const [baseline, setBaseline] = useState({ amount: "", cadence: "monthly" });

  const addAccount = () =>
    setAccounts([
      ...accounts,
      { account_name: "", account_type: "checking", current_balance: "" },
    ]);
  const removeAccount = (index: number) =>
    setAccounts(accounts.filter((_, i) => i !== index));

  const addIncome = () =>
    setIncomes([
      ...incomes,
      {
        income_name: "",
        income_type: "salary",
        amount: "",
        cadence: "monthly",
      },
    ]);
  const removeIncome = (index: number) =>
    setIncomes(incomes.filter((_, i) => i !== index));

  const addLiability = () =>
    setLiabilities([
      ...liabilities,
      {
        liability_name: "",
        liability_type: "personal_loan",
        outstanding_balance: "",
      },
    ]);
  const removeLiability = (index: number) =>
    setLiabilities(liabilities.filter((_, i) => i !== index));

  const isStepValid = () => {
    if (step === 1)
      return (
        accounts.length > 0 &&
        accounts.every((a) => a.account_name && a.current_balance !== "")
      );
    if (step === 2)
      return (
        incomes.length > 0 &&
        incomes.every((i) => i.income_name && i.amount !== "")
      );
    if (step === 3) return baseline.amount !== "";
    if (step === 4)
      return liabilities.every(
        (l) => l.liability_name && l.outstanding_balance !== "",
      );
    return false;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await submitDayZeroBaselineAction({
        accounts: accounts.map((a) => ({
          ...a,
          current_balance: Number(a.current_balance),
        })),
        incomes: incomes.map((i) => ({ ...i, amount: Number(i.amount) })),
        liabilities: liabilities
          .filter((l) => Number(l.outstanding_balance) > 0)
          .map((l) => ({
            ...l,
            outstanding_balance: Number(l.outstanding_balance),
          })),
        baseline: {
          amount: Number(baseline.amount),
          cadence: baseline.cadence,
        },
      });
      // We don't need to call onComplete here because the page will re-render or we can handle it via the action's return
      // But for consistency with the previous impl:
      window.location.reload();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Configuration failed. System offline.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-background z-[100] flex items-center justify-center p-6 md:p-12 overflow-y-auto">
      <div className="max-w-2xl w-full space-y-12 py-12">
        {/* Branding & Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-foreground rounded-xl flex items-center justify-center">
              <span className="font-black text-background text-[10px]">A</span>
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] opacity-40">
              Axiom Terminal :: Day Zero v2
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
            Financial <br /> Initialization
          </h1>
          <p className="text-foreground/40 text-xs font-bold uppercase tracking-widest max-w-md leading-relaxed">
            The Axiom engine is scaling your telemetry. Provide a comprehensive
            view of your capital structure.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 h-1">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 transition-all duration-500 rounded-full ${
                s <= step ? "bg-foreground" : "bg-foreground/10"
              }`}
            ></div>
          ))}
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="min-h-[240px] animate-in fade-in slide-in-from-bottom-4 duration-700">
            {step === 1 && (
              <div className="space-y-8">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">
                    01. Capital Repositories
                  </label>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    Where is your capital held?
                  </h2>
                </div>

                <div className="space-y-4">
                  {accounts.map((acc, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col md:flex-row gap-4 p-4 bg-foreground/5 rounded-2xl relative group"
                    >
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          placeholder="Account Name (e.g. M-Pesa, KCB)"
                          value={acc.account_name}
                          onChange={(e) => {
                            const newAccs = [...accounts];
                            newAccs[idx].account_name = e.target.value;
                            setAccounts(newAccs);
                          }}
                          className="w-full bg-transparent border-b border-foreground/10 py-2 font-bold text-sm focus:outline-none focus:border-foreground"
                        />
                        <div className="flex gap-4">
                          <select
                            value={acc.account_type}
                            onChange={(e) => {
                              const newAccs = [...accounts];
                              newAccs[idx].account_type = e.target.value;
                              setAccounts(newAccs);
                            }}
                            className="bg-transparent border-b border-foreground/10 py-2 text-[10px] font-black uppercase tracking-widest focus:outline-none"
                          >
                            {ACCOUNT_TYPES.map((t) => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            placeholder="Balance"
                            value={acc.current_balance}
                            onChange={(e) => {
                              const newAccs = [...accounts];
                              newAccs[idx].current_balance = e.target.value;
                              setAccounts(newAccs);
                            }}
                            className="flex-1 bg-transparent border-b border-foreground/10 py-2 font-black tabular-nums focus:outline-none focus:border-foreground"
                          />
                        </div>
                      </div>
                      {accounts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAccount(idx)}
                          className="p-2 text-foreground/20 hover:text-red-500 transition-colors self-center"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addAccount}
                  className="w-full py-4 border-2 border-dashed border-foreground/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:border-foreground/20 hover:text-foreground transition-all"
                >
                  + Add Another Repository
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">
                    02. Inflow Velocity
                  </label>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    How does capital arrive?
                  </h2>
                </div>

                <div className="space-y-4">
                  {incomes.map((inc, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col md:flex-row gap-4 p-4 bg-foreground/5 rounded-2xl"
                    >
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          placeholder="Source (e.g. Salary, Shop Profits)"
                          value={inc.income_name}
                          onChange={(e) => {
                            const newIncs = [...incomes];
                            newIncs[idx].income_name = e.target.value;
                            setIncomes(newIncs);
                          }}
                          className="w-full bg-transparent border-b border-foreground/10 py-2 font-bold text-sm focus:outline-none focus:border-foreground"
                        />
                        <div className="flex flex-wrap gap-4">
                          <select
                            value={inc.income_type}
                            onChange={(e) => {
                              const newIncs = [...incomes];
                              newIncs[idx].income_type = e.target.value;
                              setIncomes(newIncs);
                            }}
                            className="bg-transparent border-b border-foreground/10 py-2 text-[10px] font-black uppercase tracking-widest focus:outline-none"
                          >
                            {INCOME_TYPES.map((t) => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>
                          <select
                            value={inc.cadence}
                            onChange={(e) => {
                              const newIncs = [...incomes];
                              newIncs[idx].cadence = e.target.value;
                              setIncomes(newIncs);
                            }}
                            className="bg-transparent border-b border-foreground/10 py-2 text-[10px] font-black uppercase tracking-widest focus:outline-none"
                          >
                            {CADENCES.map((c) => (
                              <option key={c.value} value={c.value}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            placeholder="Amount"
                            value={inc.amount}
                            onChange={(e) => {
                              const newIncs = [...incomes];
                              newIncs[idx].amount = e.target.value;
                              setIncomes(newIncs);
                            }}
                            className="flex-1 min-w-[100px] bg-transparent border-b border-foreground/10 py-2 font-black tabular-nums focus:outline-none focus:border-foreground"
                          />
                        </div>
                      </div>
                      {incomes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeIncome(idx)}
                          className="p-2 text-foreground/20 hover:text-red-500 transition-colors self-center"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addIncome}
                  className="w-full py-4 border-2 border-dashed border-foreground/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:border-foreground/20 hover:text-foreground transition-all"
                >
                  + Add Another Inflow
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">
                    03. Survival Baseline
                  </label>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    What is the cost of existence?
                  </h2>
                </div>
                <div className="space-y-6 bg-foreground/5 p-8 rounded-3xl">
                  <div className="relative">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-black text-foreground/20">
                      KSh
                    </span>
                    <input
                      autoFocus
                      type="number"
                      required
                      placeholder="0.00"
                      value={baseline.amount}
                      onChange={(e) =>
                        setBaseline({ ...baseline, amount: e.target.value })
                      }
                      className="w-full bg-transparent border-b-4 border-foreground/10 py-4 pl-16 text-5xl font-black tabular-nums focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/5"
                    />
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">
                      Measured on a
                    </span>
                    <div className="flex gap-2">
                      {BASELINE_CADENCES.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() =>
                            setBaseline({ ...baseline, cadence: c.value })
                          }
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            baseline.cadence === c.value
                              ? "bg-foreground text-background"
                              : "bg-foreground/5 text-foreground/40 hover:bg-foreground/10"
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">
                      basis.
                    </span>
                  </div>
                </div>
                <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest leading-relaxed">
                  Enter your core survival cost (Rent, Food, Utilities). This
                  allows Axiom to calculate your true survival window.
                </p>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">
                    04. Immediate Obligations
                  </label>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    What does the system owe?
                  </h2>
                </div>

                <div className="space-y-4">
                  {liabilities.map((liab, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col md:flex-row gap-4 p-4 bg-foreground/5 rounded-2xl"
                    >
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          placeholder="Obligation (e.g. Fuliza, Loan)"
                          value={liab.liability_name}
                          onChange={(e) => {
                            const newLiabs = [...liabilities];
                            newLiabs[idx].liability_name = e.target.value;
                            setLiabilities(newLiabs);
                          }}
                          className="w-full bg-transparent border-b border-foreground/10 py-2 font-bold text-sm focus:outline-none focus:border-foreground"
                        />
                        <input
                          type="number"
                          placeholder="Outstanding Balance"
                          value={liab.outstanding_balance}
                          onChange={(e) => {
                            const newLiabs = [...liabilities];
                            newLiabs[idx].outstanding_balance = e.target.value;
                            setLiabilities(newLiabs);
                          }}
                          className="w-full bg-transparent border-b border-foreground/10 py-2 font-black tabular-nums focus:outline-none focus:border-foreground"
                        />
                      </div>
                      {liabilities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLiability(idx)}
                          className="p-2 text-foreground/20 hover:text-red-500 transition-colors self-center"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addLiability}
                  className="w-full py-4 border-2 border-dashed border-foreground/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:border-foreground/20 hover:text-foreground transition-all"
                >
                  + Add Another Obligation
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 animate-shake">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-red-500"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">
                {error}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 hover:text-foreground transition-colors"
              >
                Go Back
              </button>
            ) : (
              <div></div>
            )}

            <button
              type="submit"
              disabled={isLoading || !isStepValid()}
              className="px-10 py-5 bg-foreground text-background rounded-2xl font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-foreground/20 disabled:opacity-20 disabled:scale-100"
            >
              {isLoading
                ? "CALCULATING..."
                : step === 4
                  ? "Initialize System"
                  : "Next Phase"}
            </button>
          </div>
        </form>

        {/* System Status Footer */}
        <div className="pt-12 border-t border-foreground/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[9px] font-black text-foreground/30 uppercase tracking-widest">
              Analytical Precision Active
            </span>
          </div>
          <p className="text-[8px] font-bold text-foreground/20 uppercase tracking-tighter max-w-xs md:text-right">
            Verification required for system activation. Provided telemetry
            remains encrypted.
          </p>
        </div>
      </div>
    </div>
  );
}
