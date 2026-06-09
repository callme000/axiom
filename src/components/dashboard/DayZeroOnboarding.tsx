"use client";

import { useState } from "react";
import { submitDayZeroOnboardingAction } from "@/app/dashboard/actions";
import { type DashboardSnapshot } from "@/lib/dashboard/types";
import { RippleButton } from "@/components/ui/multi-type-ripple-buttons";
import { HoverButton } from "@/components/ui/hover-glow-button";
import { LuxuryCard } from "@/components/ui/luxury-card";
import { motion, AnimatePresence } from "framer-motion";

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
    title: "Accounts",
    desc: "Every strong financial foundation begins with a clear map of your available capital. Please list the financial accounts that hold your primary source of liquidity (for example, corporate checking accounts or short-term cash reserves)",
  },
  {
    roman: "II",
    title: "Income Velocity",
    desc: "Every strong financial foundation relies on a predictable cash flow. Please list your revenue-generating activities so we can calculate how quickly your funds are replenished (for example, recurring subscription fees, product sales, or monthly client retainers).",
  },
  {
    roman: "III",
    title: "Baseline Expenses",
    desc: "Every strong financial foundation requires full visibility into its baseline expenses. Please list your fixed operating costs so we can identify and eliminate unnecessary spending (for example, office rent, software subscriptions, or employee salaries).",
  },
  {
    roman: "IV",
    title: "Financial Commitments",
    desc: "Every strong financial foundation requires a clear view of what you owe. Please list your current debts and upcoming financial obligations so we can protect your long-term solvency (for example, short-term loans, credit card balances, or vendor invoices).",
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
      // PURE DELEGATION: Send raw state to server for transformation and persistence
      const snapshot = await submitDayZeroOnboardingAction({
        accounts,
        incomes,
        liabilities,
        baselines,
      });

      // SEAMLESS TRANSITION: No hard reload. Revalidation is handled by server action.
      onComplete(snapshot);
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

  const activeStepConfig = STEPS[step - 1];
  const backgroundX = -(step - 1) * 5;

  return (
    <div className="fixed inset-0 bg-black z-100 flex flex-col selection:bg-white selection:text-black overflow-hidden h-screen w-full font-sans text-white">
      {/* Dynamic Background */}
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

      <OnboardingHeader step={step} totalSteps={STEPS.length} />

      <div className="relative z-10 flex-1 flex items-center justify-center px-8 md:px-12 pt-16">
        <div className="max-w-7xl w-full h-155 grid lg:grid-cols-[1.1fr_1.4fr] gap-16 md:gap-24 items-stretch overflow-visible">
          <OnboardingSidebar
            roman={activeStepConfig.roman}
            title={activeStepConfig.title}
            desc={activeStepConfig.desc}
            direction={direction}
          />

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
