"use client";

import { useState } from "react";
import { submitDayZeroOnboardingAction } from "@/app/dashboard/actions";
import { type DashboardSnapshot } from "@/lib/dashboard/types";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, TrendingUp, Flame, ShieldAlert, Zap } from "lucide-react";

import {
  OnboardingHeader,
  OnboardingSidebar,
} from "./onboarding/OnboardingLayout";
import {
  AccountsStep,
  type OnboardingAccount,
} from "./onboarding/AccountsStep";
import {
  IncomeVelocityStep,
  type OnboardingIncome,
} from "./onboarding/IncomeVelocityStep";
import {
  ExpensesStep,
  type OnboardingBaseline,
} from "./onboarding/ExpensesStep";
import {
  LiabilitiesStep,
  type OnboardingLiability,
} from "./onboarding/LiabilitiesStep";

interface DayZeroOnboardingProps {
  onComplete: (snapshot: DashboardSnapshot) => void;
}

const STEPS = [
  {
    roman: "I",
    icon: Wallet,
    color: "var(--truth)",
    title: "Accounts",
    desc: "Map initial capital distribution. List primary liquidity vehicles for architecture baseline.",
  },
  {
    roman: "II",
    icon: TrendingUp,
    color: "var(--opportunity)",
    title: "Yield Velocity",
    desc: "Define inbound cash flow parameters. Calculate capital replenishment speed.",
  },
  {
    roman: "III",
    icon: Flame,
    color: "var(--leakage)",
    title: "Baseline Burn",
    desc: "Quantify structural maintenance costs. Identify high-leakage vectors.",
  },
  {
    roman: "IV",
    icon: ShieldAlert,
    color: "var(--warning)",
    title: "Solvency Risks",
    desc: "Map current liabilities. Establish debt-to-capital alignment ratio.",
  },
];

export default function DayZeroOnboarding({
  onComplete,
}: DayZeroOnboardingProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State Management
  const [accounts, setAccounts] = useState<OnboardingAccount[]>([
    {
      account_name: "",
      account_type: "mobile_money",
      current_balance: "",
      institution: "",
    },
  ]);
  const [incomes, setIncomes] = useState<OnboardingIncome[]>([]);
  const [baselines, setBaselines] = useState<OnboardingBaseline[]>([
    {
      title: "",
      amount: "",
      cadence: "monthly",
      execution_day: "1",
      is_recurring: true,
      category: "Maintenance",
    },
  ]);
  const [liabilities, setLiabilities] = useState<OnboardingLiability[]>([]);

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
      const snapshot = await submitDayZeroOnboardingAction({
        accounts,
        incomes,
        liabilities,
        baselines,
      });
      onComplete(snapshot);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "System Error: Input verification failed.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  const activeStepConfig = STEPS[step - 1];

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col selection:bg-white selection:text-black overflow-hidden h-screen w-full font-mono text-foreground">
      {/* Clinical Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />

      <OnboardingHeader step={step} totalSteps={STEPS.length} />

      <div className="relative z-10 flex-1 flex items-start md:items-center justify-center px-4 md:px-12 pt-32 md:pt-16 pb-12 overflow-y-auto">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-[0.9fr_1.6fr] gap-12 md:gap-24 items-stretch overflow-visible">
          <OnboardingSidebar
            roman={activeStepConfig.roman}
            icon={activeStepConfig.icon}
            iconColor={activeStepConfig.color}
            title={activeStepConfig.title}
            desc={activeStepConfig.desc}
            direction={direction}
          />

          <div className="flex flex-col border border-white/10 bg-[#0a0a0a] rounded-sm overflow-hidden min-h-[500px] md:min-h-0 shadow-2xl">
            <div className="flex-1 p-6 md:p-14 overflow-hidden relative">
              <form
                onSubmit={handleSubmit}
                className="h-full flex flex-col text-foreground"
              >
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -direction * 10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex-1 flex flex-col"
                  >
                    {step === 1 && (
                      <AccountsStep
                        accounts={accounts}
                        onChange={setAccounts}
                      />
                    )}
                    {step === 2 && (
                      <IncomeVelocityStep
                        incomes={incomes}
                        onChange={setIncomes}
                      />
                    )}
                    {step === 3 && (
                      <ExpensesStep
                        baselines={baselines}
                        onChange={setBaselines}
                      />
                    )}
                    {step === 4 && (
                      <LiabilitiesStep
                        liabilities={liabilities}
                        onChange={setLiabilities}
                      />
                    )}
                    {step === 5 && terminalOutput && (
                      <div className="flex-1 flex flex-col justify-center items-center h-full">
                        <div className="space-y-6 w-full max-w-lg text-center">
                          <div className="inline-flex items-center gap-4 text-zinc-500 mb-4">
                            <div className="h-px w-8 bg-zinc-800" />
                            <span className="text-[9px] tracking-[0.8em] uppercase">
                              Analysis Complete
                            </span>
                            <div className="h-px w-8 bg-zinc-800" />
                          </div>
                          
                          <div className="bg-[#111] border border-white/10 rounded-sm p-8 text-left space-y-8 font-mono shadow-2xl">
                            <div className="space-y-2">
                              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Structural Burn Rate</p>
                              <p className="text-3xl text-white font-bold tracking-tighter">
                                ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(terminalOutput.burnRate)} <span className="text-sm text-zinc-500 font-normal">/mo</span>
                              </p>
                            </div>
                            
                            <div className="h-px w-full bg-white/5" />
                            
                            <div className="space-y-2">
                              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Current Horizon (Runway)</p>
                              <div className="flex items-baseline gap-3">
                                <p className="text-4xl text-[var(--opportunity)] font-bold tracking-tighter">
                                  {terminalOutput.runway.toFixed(1)}
                                </p>
                                <p className="text-sm text-zinc-400">days</p>
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-zinc-400 leading-relaxed pt-4">
                            Your baseline is mapped. Axiom is now monitoring your structural solvency.
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </form>
            </div>

            <div className="h-24 md:h-28 border-t border-white/10 relative z-10 px-6 md:px-16 flex flex-col justify-center shrink-0 bg-black">
              {error && (
                <div className="absolute top-0 left-0 w-full transform -translate-y-full px-6 md:px-12 pb-4">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-sm p-3 text-red-500 text-[10px] font-bold tracking-wider flex items-center gap-3">
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    {error}
                  </div>
                </div>
              )}
              <div className="w-full flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={step === 1 || step === 5}
                  className={`text-[10px] font-bold tracking-[0.4em] text-zinc-600 hover:text-white transition-all uppercase py-4 px-8 border border-transparent hover:border-white/5 ${step === 5 || step === 1 ? "opacity-0 pointer-events-none" : ""}`}
                >
                  ← PREV_PHASE
                </button>
                <div onClick={handleSubmit}>
                  <button
                    disabled={isLoading || !isStepValid()}
                    className="px-12 py-4 bg-white text-black font-bold text-[10px] tracking-[0.4em] uppercase hover:bg-zinc-200 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {step === 4 ? (
                      <>
                        <Zap size={14} />
                        CALCULATE_HORIZON
                      </>
                    ) : step === 5 ? (
                      "INITIALIZE_DASHBOARD →"
                    ) : (
                      "NEXT_PHASE →"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
