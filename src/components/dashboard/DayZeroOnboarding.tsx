"use client";

import { useState } from "react";
import {
  submitDayZeroBaselineAction,
  type DashboardSnapshot,
} from "@/app/dashboard/actions";
import { BrandMark } from "@/components/ui/brand-mark";
import { RippleButton } from "@/components/ui/multi-type-ripple-buttons";
import { HoverButton } from "@/components/ui/hover-glow-button";
import { LuxuryCard } from "@/components/ui/luxury-card";
import { motion, AnimatePresence } from "framer-motion";
import { TAXONOMY_CATEGORIES } from "@/lib/finance/taxonomy";

interface DayZeroOnboardingProps {
  onComplete: (snapshot: DashboardSnapshot) => void;
}

const ACCOUNT_TYPES = [
  { value: "mobile_money", label: "Mobile Money" },
  { value: "checking", label: "Checking" },
  { value: "savings", label: "Savings" },
  { value: "cash", label: "Cash" },
  { value: "crypto", label: "Crypto" },
];

const INCOME_TYPES = [
  { value: "salary", label: "Salary" },
  { value: "freelance", label: "Freelance" },
  { value: "business", label: "Business" },
  { value: "other", label: "Other" },
];

const LIABILITY_TYPES = [
  { value: "credit_card", label: "Credit Card" },
  { value: "mortgage", label: "Mortgage" },
  { value: "personal_loan", label: "Personal Loan" },
  { value: "student_loan", label: "Student Loan" },
  { value: "business_loan", label: "Business Loan" },
  { value: "line_of_credit", label: "Line of Credit" },
  { value: "other", label: "Other" },
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

const STEPS = [
  {
    roman: "I",
    title: "Capital Repositories",
    desc: "Define your primary liquidity containers. Every sovereign architecture begins with a clear map of available capital.",
  },
  {
    roman: "II",
    title: "Inflow Velocity",
    desc: "Map your yield-generating transaction streams. Understanding your replenishment rate is critical for deterministic runway.",
  },
  {
    roman: "III",
    title: "Survival Baseline",
    desc: "Determine your core structural cost of existence. We audit your maintenance load to identify systemic leakage.",
  },
  {
    roman: "IV",
    title: "Immediate Obligations",
    desc: "Audit your outstanding liabilities. Strategic solvency requires a clinical view of all near-term commitments.",
  },
];

export default function DayZeroOnboarding({
  onComplete,
}: DayZeroOnboardingProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [accounts, setAccounts] = useState([
    {
      account_name: "",
      account_type: "mobile_money",
      current_balance: "",
      institution: "",
    },
  ]);
  const [incomes, setIncomes] = useState<
    {
      income_name: string;
      income_type: string;
      amount: string;
      cadence: string;
      execution_day: string;
      is_recurring: boolean;
      source: string;
    }[]
  >([]);
  const [baselines, setBaselines] = useState([
    {
      title: "",
      amount: "",
      cadence: "monthly",
      category: "Maintenance",
    },
  ]);
  const [liabilities, setLiabilities] = useState<
    {
      liability_name: string;
      liability_type: string;
      outstanding_balance: string;
      institution: string;
      is_paid_in_cadences: boolean;
      cadence: string;
      cadence_day_date: string;
      cadence_amount: string;
    }[]
  >([]);

  const addAccount = () => {
    if (accounts.length < 3)
      setAccounts([
        ...accounts,
        {
          account_name: "",
          account_type: "checking",
          current_balance: "",
          institution: "",
        },
      ]);
  };
  const removeAccount = (index: number) =>
    setAccounts(accounts.filter((_, i) => i !== index));

  const addIncome = () => {
    if (incomes.length < 3)
      setIncomes([
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
  };
  const removeIncome = (index: number) =>
    setIncomes(incomes.filter((_, i) => i !== index));

  const addBaseline = () => {
    if (baselines.length < 3)
      setBaselines([
        ...baselines,
        { title: "", amount: "", cadence: "monthly", category: "Maintenance" },
      ]);
  };
  const removeBaseline = (index: number) =>
    setBaselines(baselines.filter((_, i) => i !== index));

  const addLiability = () => {
    if (liabilities.length < 2)
      setLiabilities([
        ...liabilities,
        {
          liability_name: "",
          liability_type: "credit_card",
          outstanding_balance: "",
          institution: "",
          is_paid_in_cadences: false,
          cadence: "monthly",
          cadence_day_date: "1",
          cadence_amount: "",
        },
      ]);
  };
  const removeLiability = (index: number) =>
    setLiabilities(liabilities.filter((_, i) => i !== index));

  const isStepValid = () => {
    if (step === 1)
      return (
        accounts.length > 0 &&
        accounts.every((a) => a.account_name.trim() && a.current_balance !== "")
      );
    if (step === 2)
      return (
        incomes.length === 0 ||
        incomes.every((i) => i.income_name.trim() && i.amount !== "")
      );
    if (step === 3)
      return (
        baselines.length > 0 &&
        baselines.every((b) => b.title.trim() && b.amount !== "")
      );
    if (step === 4)
      return (
        liabilities.length === 0 ||
        liabilities.every(
          (l) => l.liability_name.trim() && l.outstanding_balance !== "",
        )
      );
    return false;
  };

  const handleNext = () => {
    if (step < 4) {
      setDirection(1);
      setStep(step + 1);
      setError(null);
    }
  };
  const handlePrev = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
      setError(null);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < 4) {
      handleNext();
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await submitDayZeroBaselineAction({
        accounts: accounts.map((a) => ({
          account_name: a.account_name,
          account_type: a.account_type,
          current_balance: Number(a.current_balance),
          institution: a.institution || undefined,
        })),
        incomes: incomes.map((i) => ({
          income_name: i.income_name,
          income_type: i.income_type,
          amount: Number(i.amount),
          cadence: i.cadence,
          execution_day:
            i.cadence === "monthly" ||
            i.cadence === "weekly" ||
            i.cadence === "biweekly"
              ? Number(i.execution_day)
              : null,
          is_recurring: i.is_recurring,
          source: i.source || undefined,
        })),
        liabilities: liabilities
          .filter((l) => Number(l.outstanding_balance) > 0)
          .map((l) => ({
            liability_name: l.liability_name,
            liability_type: l.liability_type,
            outstanding_balance: Number(l.outstanding_balance),
            interest_rate: 0,
            institution: l.institution || undefined,
            is_paid_in_cadences: l.is_paid_in_cadences,
            cadence: l.is_paid_in_cadences ? l.cadence : null,
            cadence_day_date: l.is_paid_in_cadences
              ? String(l.cadence_day_date)
              : null,
            cadence_amount: l.is_paid_in_cadences
              ? Number(l.cadence_amount)
              : null,
          })),
        baselines: baselines.map((b) => ({
          title: b.title,
          amount: Number(b.amount),
          cadence: b.cadence,
          category: b.category,
        })),
      });
      window.location.reload();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please verify your inputs.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  const activeStep = STEPS[step - 1];
  const backgroundX = -(step - 1) * 5;

  return (
    <div className="fixed inset-0 bg-black z-100 flex flex-col selection:bg-white selection:text-black overflow-hidden h-screen w-full font-sans text-white">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: `${backgroundX}%` }}
          transition={{ duration: 1.2, ease: [0.215, 0.61, 0.355, 1] }}
          className="absolute inset-0 w-[150%] h-full"
        >
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/2 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[30%] w-[40%] h-[40%] bg-white/2 rounded-full blur-[120px]" />
          <div
            className="absolute inset-0 opacity-15 mix-blend-screen grayscale"
            style={{
              backgroundImage: "url('/images/tactical-schematic.png')",
              backgroundSize: "cover",
              backgroundPosition: "left center",
            }}
          />
        </motion.div>
      </div>

      <nav className="absolute top-0 left-0 w-full z-50 px-12 py-10 flex justify-between items-center mix-blend-difference pointer-events-none">
        <div className="flex items-center gap-6 group cursor-pointer pointer-events-auto">
          <BrandMark className="w-10 h-10" />
          <div className="flex flex-col">
            <span className="font-mono text-[10px] tracking-[0.6em] uppercase font-bold text-white">
              AXIOM
            </span>
            <span className="text-[8px] font-mono tracking-[0.4em] uppercase text-white/40">
              Architecture
            </span>
          </div>
        </div>
        <div className="flex gap-12 items-center pointer-events-auto">
          <div className="hidden md:flex gap-8">
            {STEPS.map((s, idx) => (
              <div
                key={s.roman}
                className="flex flex-col items-center gap-2 text-white"
              >
                <span
                  className={`font-mono text-[9px] tracking-widest transition-colors duration-700 ${idx + 1 === step ? "opacity-100" : "opacity-10"}`}
                >
                  {s.roman}
                </span>
                <motion.div
                  animate={{ scaleX: idx + 1 === step ? 1 : 0 }}
                  className="h-px w-4 bg-white origin-left"
                />
              </div>
            ))}
          </div>
          <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-white/20">
            v1.0
          </span>
        </div>
      </nav>

      <div className="relative z-10 flex-1 flex items-center justify-center px-8 md:px-12 pt-16">
        <div className="max-w-7xl w-full h-155 grid lg:grid-cols-[1.1fr_1.4fr] gap-16 md:gap-24 items-stretch overflow-visible">
          <div className="flex flex-col justify-center h-full border-r border-white/5 pr-12 text-white overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                initial={{ opacity: 0, x: direction * 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 50 }}
                transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <div className="font-cormorant italic text-8xl text-white/5 leading-none select-none">
                    {activeStep.roman}
                  </div>
                  <h1 className="font-cormorant text-6xl text-white leading-none tracking-tight">
                    {activeStep.title}
                  </h1>
                </div>
                <p className="text-white/40 text-lg font-light leading-relaxed">
                  {activeStep.desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <LuxuryCard className="h-full flex flex-col border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden">
            <div className="flex-1 p-10 md:p-14 overflow-hidden relative rounded-t-[inherit]">
              <form
                onSubmit={handleSubmit}
                className="h-full flex flex-col text-white"
              >
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -direction * 30 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex-1 flex flex-col"
                  >
                    {step === 1 && (
                      <div className="flex flex-col h-full gap-6">
                        <h2 className="font-cormorant text-2xl text-white tracking-wide uppercase">
                          Capital Repositories
                        </h2>
                        <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide pr-2">
                          {accounts.map((acc, idx) => (
                            <div
                              key={idx}
                              className="space-y-3 pb-3 border-b border-white/5 relative shrink-0"
                            >
                              <div className="grid grid-cols-2 gap-6">
                                <input
                                  type="text"
                                  placeholder="Repository Name"
                                  value={acc.account_name}
                                  onChange={(e) => {
                                    const n = [...accounts];
                                    n[idx].account_name = e.target.value;
                                    setAccounts(n);
                                  }}
                                  className="bg-transparent border-b border-white/10 py-1 font-cormorant text-2xl text-white focus:outline-none placeholder:text-white/5"
                                />
                                <input
                                  type="text"
                                  placeholder="Financial Institution"
                                  value={acc.institution}
                                  onChange={(e) => {
                                    const n = [...accounts];
                                    n[idx].institution = e.target.value;
                                    setAccounts(n);
                                  }}
                                  className="bg-transparent border-b border-white/10 py-1 text-sm font-light text-white/60 focus:outline-none placeholder:text-white/5"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em]">
                                    Repository Type
                                  </label>
                                  <select
                                    value={acc.account_type}
                                    onChange={(e) => {
                                      const n = [...accounts];
                                      n[idx].account_type = e.target.value;
                                      setAccounts(n);
                                    }}
                                    className="w-full bg-transparent border-b border-white/10 py-1 text-[10px] font-mono tracking-widest uppercase text-white/40 focus:outline-none"
                                  >
                                    {ACCOUNT_TYPES.map((t) => (
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
                                  <label className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em]">
                                    Current Liquidity
                                  </label>
                                  <input
                                    type="number"
                                    placeholder="0.00"
                                    value={acc.current_balance}
                                    onChange={(e) => {
                                      const n = [...accounts];
                                      n[idx].current_balance = e.target.value;
                                      setAccounts(n);
                                    }}
                                    className="w-full bg-transparent border-b border-white/10 py-1 text-xl font-light text-white focus:outline-none tabular-nums"
                                  />
                                </div>
                              </div>
                              {accounts.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeAccount(idx)}
                                  className="absolute top-0 right-0 p-2 text-white/10 hover:text-red-400 bg-white/5 rounded-full hover:bg-white/10 transition-all"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={addAccount}
                          className="text-[9px] font-mono tracking-[0.6em] uppercase text-white/30 hover:text-white transition-all py-3 px-6 border border-white/10 rounded-full self-start active:scale-95"
                        >
                          + Append Source
                        </button>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="flex flex-col h-full gap-6">
                        <h2 className="font-cormorant text-2xl text-white tracking-wide uppercase">
                          Inflow Velocity
                        </h2>
                        <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide pr-2">
                          {incomes.map((inc, idx) => (
                            <div
                              key={idx}
                              className="space-y-3 pb-3 border-b border-white/5 relative shrink-0"
                            >
                              <div className="grid grid-cols-2 gap-6">
                                <input
                                  type="text"
                                  placeholder="Source Name"
                                  value={inc.income_name}
                                  onChange={(e) => {
                                    const n = [...incomes];
                                    n[idx].income_name = e.target.value;
                                    setIncomes(n);
                                  }}
                                  className="bg-transparent border-b border-white/10 py-1 font-cormorant text-2xl text-white focus:outline-none placeholder:text-white/5"
                                />
                                <input
                                  type="text"
                                  placeholder="Origin"
                                  value={inc.source}
                                  onChange={(e) => {
                                    const n = [...incomes];
                                    n[idx].source = e.target.value;
                                    setIncomes(n);
                                  }}
                                  className="bg-transparent border-b border-white/10 py-1 text-sm font-light text-white/60 focus:outline-none placeholder:text-white/5"
                                />
                              </div>
                              <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em]">
                                    Type
                                  </label>
                                  <select
                                    value={inc.income_type}
                                    onChange={(e) => {
                                      const n = [...incomes];
                                      n[idx].income_type = e.target.value;
                                      setIncomes(n);
                                    }}
                                    className="w-full bg-transparent border-b border-white/10 py-1 text-[10px] font-mono tracking-widest uppercase text-white/40 focus:outline-none"
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
                                  <label className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em]">
                                    Frequency
                                  </label>
                                  <select
                                    value={inc.cadence}
                                    onChange={(e) => {
                                      const n = [...incomes];
                                      n[idx].cadence = e.target.value;
                                      setIncomes(n);
                                    }}
                                    className="w-full bg-transparent border-b border-white/10 py-1 text-[10px] font-mono tracking-widest uppercase text-white/40 focus:outline-none"
                                  >
                                    {CADENCES.map((c) => (
                                      <option
                                        key={c.value}
                                        value={c.value}
                                        className="bg-[#080808]"
                                      >
                                        {c.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em]">
                                    KES
                                  </label>
                                  <input
                                    type="number"
                                    placeholder="0.00"
                                    value={inc.amount}
                                    onChange={(e) => {
                                      const n = [...incomes];
                                      n[idx].amount = e.target.value;
                                      setIncomes(n);
                                    }}
                                    className="w-full bg-transparent border-b border-white/10 py-1 text-xl font-light text-white focus:outline-none tabular-nums"
                                  />
                                </div>
                              </div>

                              <div className="pt-2 space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                  <label className="flex items-center space-x-3 cursor-pointer group">
                                    <input
                                      type="checkbox"
                                      checked={inc.is_recurring}
                                      onChange={(e) => {
                                        const n = [...incomes];
                                        n[idx].is_recurring = e.target.checked;
                                        setIncomes(n);
                                      }}
                                      className="w-3 h-3 rounded border-white/10 bg-transparent checked:bg-white transition-colors"
                                    />
                                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest group-hover:text-white/60">
                                      Recurring
                                    </span>
                                  </label>
                                  {(inc.cadence === "monthly" ||
                                    inc.cadence === "weekly" ||
                                    inc.cadence === "biweekly") && (
                                    <div className="flex items-center gap-3">
                                      <label className="text-[8px] font-mono text-white/20 uppercase">
                                        Execution Day
                                      </label>
                                      <input
                                        type="number"
                                        min="1"
                                        max="31"
                                        value={inc.execution_day || ""}
                                        onChange={(e) => {
                                          const n = [...incomes];
                                          n[idx].execution_day = e.target.value;
                                          setIncomes(n);
                                        }}
                                        className="w-12 bg-transparent border-b border-white/10 py-0.5 text-[10px] text-white focus:outline-none text-center"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeIncome(idx)}
                                className="absolute top-0 right-0 p-2 text-white/10 hover:text-red-400 bg-white/5 rounded-full hover:bg-white/10 transition-all"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={addIncome}
                          className="text-[9px] font-mono tracking-[0.6em] uppercase text-white/30 hover:text-white transition-all py-3 px-6 border border-white/10 rounded-full self-start active:scale-95"
                        >
                          + Append Inflow
                        </button>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="flex flex-col h-full gap-6">
                        <h2 className="font-cormorant text-2xl text-white tracking-wide uppercase">
                          Survival Baseline
                        </h2>
                        <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide pr-2">
                          {baselines.map((base, idx) => (
                            <div
                              key={idx}
                              className="space-y-3 pb-3 border-b border-white/5 relative shrink-0"
                            >
                              <div className="grid grid-cols-2 gap-6">
                                <input
                                  type="text"
                                  placeholder="Baseline Name"
                                  value={base.title}
                                  onChange={(e) => {
                                    const n = [...baselines];
                                    n[idx].title = e.target.value;
                                    setBaselines(n);
                                  }}
                                  className="bg-transparent border-b border-white/10 py-1 font-cormorant text-2xl text-white focus:outline-none placeholder:text-white/5"
                                />
                                <div className="space-y-1">
                                  <label className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em]">
                                    Category
                                  </label>
                                  <select
                                    value={base.category}
                                    onChange={(e) => {
                                      const n = [...baselines];
                                      n[idx].category = e.target.value;
                                      setBaselines(n);
                                    }}
                                    className="bg-transparent border-b border-white/10 py-1 text-[10px] font-mono tracking-widest uppercase text-white/40 focus:outline-none w-full"
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
                              <div className="grid grid-cols-2 gap-12">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em]">
                                    Frequency
                                  </label>
                                  <select
                                    value={base.cadence}
                                    onChange={(e) => {
                                      const n = [...baselines];
                                      n[idx].cadence = e.target.value;
                                      setBaselines(n);
                                    }}
                                    className="w-full bg-transparent border-b border-white/10 py-1 text-[10px] font-mono tracking-widest uppercase text-white/40 focus:outline-none"
                                  >
                                    {BASELINE_CADENCES.map((c) => (
                                      <option
                                        key={c.value}
                                        value={c.value}
                                        className="bg-[#080808]"
                                      >
                                        {c.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em]">
                                    Amount
                                  </label>
                                  <input
                                    type="number"
                                    placeholder="0.00"
                                    value={base.amount}
                                    onChange={(e) => {
                                      const n = [...baselines];
                                      n[idx].amount = e.target.value;
                                      setBaselines(n);
                                    }}
                                    className="w-full bg-transparent border-b border-white/10 py-1 text-xl font-light text-white focus:outline-none tabular-nums"
                                  />
                                </div>
                              </div>
                              {baselines.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeBaseline(idx)}
                                  className="absolute top-0 -right-10 p-2 text-white/10 hover:text-red-400"
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
                          className="text-[9px] font-mono tracking-[0.6em] uppercase text-white/30 hover:text-white transition-all py-3 px-6 border border-white/10 rounded-full self-start active:scale-95"
                        >
                          + Append Recurring
                        </button>
                      </div>
                    )}

                    {step === 4 && (
                      <div className="flex flex-col h-full gap-6">
                        <h2 className="font-cormorant text-2xl text-white tracking-wide uppercase">
                          Immediate Obligations
                        </h2>
                        <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide pr-2">
                          {liabilities.map((liab, idx) => (
                            <div
                              key={idx}
                              className="space-y-3 pb-3 border-b border-white/5 relative shrink-0"
                            >
                              <div className="grid grid-cols-2 gap-6">
                                <input
                                  type="text"
                                  placeholder="Obligation Name"
                                  value={liab.liability_name}
                                  onChange={(e) => {
                                    const n = [...liabilities];
                                    n[idx].liability_name = e.target.value;
                                    setLiabilities(n);
                                  }}
                                  className="bg-transparent border-b border-white/10 py-1 font-cormorant text-2xl text-white focus:outline-none placeholder:text-white/5"
                                />
                                <input
                                  type="text"
                                  placeholder="Financial Institution"
                                  value={liab.institution}
                                  onChange={(e) => {
                                    const n = [...liabilities];
                                    n[idx].institution = e.target.value;
                                    setLiabilities(n);
                                  }}
                                  className="bg-transparent border-b border-white/10 py-1 text-sm font-light text-white/60 focus:outline-none placeholder:text-white/5"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-12">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em]">
                                    Type
                                  </label>
                                  <select
                                    value={liab.liability_type}
                                    onChange={(e) => {
                                      const n = [...liabilities];
                                      n[idx].liability_type = e.target.value;
                                      setLiabilities(n);
                                    }}
                                    className="w-full bg-transparent border-b border-white/10 py-1 text-[11px] font-mono tracking-widest uppercase text-white/40 focus:outline-none"
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
                                <div className="space-y-1">
                                  <label className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em]">
                                    Outstanding Balance
                                  </label>
                                  <input
                                    type="number"
                                    placeholder="0"
                                    value={liab.outstanding_balance}
                                    onChange={(e) => {
                                      const n = [...liabilities];
                                      n[idx].outstanding_balance =
                                        e.target.value;
                                      setLiabilities(n);
                                    }}
                                    className="w-full bg-transparent border-b border-white/10 py-1 text-2xl font-light text-white focus:outline-none tabular-nums"
                                  />
                                </div>
                              </div>

                              <div className="pt-2 space-y-3">
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                  <input
                                    type="checkbox"
                                    checked={liab.is_paid_in_cadences}
                                    onChange={(e) => {
                                      const n = [...liabilities];
                                      n[idx].is_paid_in_cadences =
                                        e.target.checked;
                                      setLiabilities(n);
                                    }}
                                    className="w-4 h-4 rounded border-white/10 bg-transparent checked:bg-white transition-colors cursor-pointer"
                                  />
                                  <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest group-hover:text-white/60 transition-colors">
                                    Paid in Cadence
                                  </span>
                                </label>
                                {liab.is_paid_in_cadences && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid grid-cols-3 gap-6 pt-2 pl-8 border-l border-white/5"
                                  >
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-mono text-white/20 uppercase">
                                        Cadence
                                      </label>
                                      <select
                                        value={liab.cadence}
                                        onChange={(e) => {
                                          const n = [...liabilities];
                                          n[idx].cadence = e.target.value;
                                          setLiabilities(n);
                                        }}
                                        className="w-full bg-transparent border-b border-white/10 py-1 text-[10px] font-mono text-white/60 focus:outline-none"
                                      >
                                        <option
                                          value="weekly"
                                          className="bg-black"
                                        >
                                          Weekly
                                        </option>
                                        <option
                                          value="monthly"
                                          className="bg-black"
                                        >
                                          Monthly
                                        </option>
                                      </select>
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-mono text-white/20 uppercase">
                                        Day
                                      </label>
                                      <input
                                        type="text"
                                        placeholder="15"
                                        value={liab.cadence_day_date || ""}
                                        onChange={(e) => {
                                          const n = [...liabilities];
                                          n[idx].cadence_day_date =
                                            e.target.value;
                                          setLiabilities(n);
                                        }}
                                        className="w-full bg-transparent border-b border-white/10 py-1 text-[10px] font-mono text-white/60 focus:outline-none"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-mono text-white/20 uppercase">
                                        Payment
                                      </label>
                                      <input
                                        type="number"
                                        placeholder="0"
                                        value={liab.cadence_amount || ""}
                                        onChange={(e) => {
                                          const n = [...liabilities];
                                          n[idx].cadence_amount =
                                            e.target.value;
                                          setLiabilities(n);
                                        }}
                                        className="w-full bg-transparent border-b border-white/10 py-1 text-[10px] font-mono text-white/60 focus:outline-none"
                                      />
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => removeLiability(idx)}
                                className="absolute top-0 right-0 p-2 text-white/10 hover:text-red-400 bg-white/5 rounded-full hover:bg-white/10 transition-all"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={addLiability}
                          className="text-[11px] font-mono tracking-[0.6em] uppercase text-white/30 hover:text-white transition-all py-4 px-8 border border-white/10 rounded-full self-start active:scale-95"
                        >
                          + Append Obligation
                        </button>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </form>
            </div>

            <div className="h-32 border-t border-white/5 relative z-10 px-12 md:px-16 flex flex-col justify-center shrink-0 bg-[#080808]/60 backdrop-blur-3xl rounded-b-[inherit]">
              {error && (
                <div className="absolute top-0 left-0 w-full transform -translate-y-full px-12 pb-4">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-[10px] font-mono tracking-wider flex items-center gap-3">
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    {error}
                  </div>
                </div>
              )}
              <div className="w-full flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={step === 1}
                  className="text-[11px] font-mono tracking-[0.6em] text-white/20 hover:text-white transition-all uppercase disabled:opacity-0 py-8 px-12 -ml-12 hover:bg-white/5 rounded-full"
                >
                  ← Back
                </button>
                <div onClick={handleSubmit}>
                  {step === 4 ? (
                    <HoverButton
                      glowColor="rgba(255,255,255,0.4)"
                      className="px-24 py-10 rounded-full text-[11px]"
                      disabled={isLoading || !isStepValid()}
                    >
                      {isLoading ? "..." : "Archive Setup"}
                    </HoverButton>
                  ) : (
                    <RippleButton
                      variant="hoverborder"
                      className="px-24 py-10 border-none text-[11px]"
                      disabled={isLoading || !isStepValid()}
                    >
                      Next Phase →
                    </RippleButton>
                  )}
                </div>
              </div>
            </div>
          </LuxuryCard>
        </div>
      </div>
    </div>
  );
}
