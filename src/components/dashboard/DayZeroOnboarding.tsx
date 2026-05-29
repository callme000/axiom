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

export default function DayZeroOnboarding({
  onComplete,
}: DayZeroOnboardingProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    mpesaBalance: "",
    fulizaDebt: "",
    survivalTarget: "",
  });

  const isStepValid = () => {
    if (step === 1)
      return form.mpesaBalance !== "" && !isNaN(Number(form.mpesaBalance));
    if (step === 2)
      return form.fulizaDebt !== "" && !isNaN(Number(form.fulizaDebt));
    if (step === 3)
      return form.survivalTarget !== "" && !isNaN(Number(form.survivalTarget));
    return false;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const snapshot = await submitDayZeroBaselineAction({
        mpesaBalance: Number(form.mpesaBalance) || 0,
        fulizaDebt: Number(form.fulizaDebt) || 0,
        survivalTarget: Number(form.survivalTarget) || 0,
      });
      onComplete(snapshot);
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
      <div className="max-w-xl w-full space-y-12 py-12">
        {/* Branding & Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-foreground rounded-xl flex items-center justify-center">
              <span className="font-black text-background text-[10px]">A</span>
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] opacity-40">
              Axiom Terminal :: Day Zero
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
            Establish Financial <br /> Authority
          </h1>
          <p className="text-foreground/40 text-xs font-bold uppercase tracking-widest max-w-sm leading-relaxed">
            The Axiom engine requires a deterministic mathematical baseline to
            activate behavioral intelligence.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 h-1">
          {[1, 2, 3].map((s) => (
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
          <div className="min-h-[160px] animate-in fade-in slide-in-from-bottom-4 duration-700">
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">
                    01. Liquid Reserves
                  </label>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    Current M-Pesa / Bank Balance
                  </h2>
                </div>
                <div className="relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-black text-foreground/20">
                    KSh
                  </span>
                  <input
                    autoFocus
                    type="number"
                    required
                    placeholder="0.00"
                    value={form.mpesaBalance}
                    onChange={(e) =>
                      setForm({ ...form, mpesaBalance: e.target.value })
                    }
                    className="w-full bg-transparent border-b-4 border-foreground/10 py-4 pl-16 text-5xl font-black tabular-nums focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/5"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">
                    02. Immediate Credit
                  </label>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    Outstanding Fuliza / Digital Loans
                  </h2>
                </div>
                <div className="relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-black text-foreground/20">
                    KSh
                  </span>
                  <input
                    autoFocus
                    type="number"
                    required
                    placeholder="0.00"
                    value={form.fulizaDebt}
                    onChange={(e) =>
                      setForm({ ...form, fulizaDebt: e.target.value })
                    }
                    className="w-full bg-transparent border-b-4 border-foreground/10 py-4 pl-16 text-5xl font-black tabular-nums focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/5"
                  />
                </div>
                <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
                  Enter 0 if you have no active digital credit obligations.
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">
                    03. Survival Baseline
                  </label>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    Monthly Survival Target (Rent/Food)
                  </h2>
                </div>
                <div className="relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-black text-foreground/20">
                    KSh
                  </span>
                  <input
                    autoFocus
                    type="number"
                    required
                    placeholder="0.00"
                    value={form.survivalTarget}
                    onChange={(e) =>
                      setForm({ ...form, survivalTarget: e.target.value })
                    }
                    className="w-full bg-transparent border-b-4 border-foreground/10 py-4 pl-16 text-5xl font-black tabular-nums focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/5"
                  />
                </div>
                <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
                  Estimated monthly core survival cost for accurate runway
                  calculation.
                </p>
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
                ? "INITIALIZING..."
                : step === 3
                  ? "Activate System"
                  : "Next Parameter"}
            </button>
          </div>
        </form>

        {/* System Status Footer */}
        <div className="pt-12 border-t border-foreground/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[9px] font-black text-foreground/30 uppercase tracking-widest">
              Secure Auth Layer Active
            </span>
          </div>
          <p className="text-[8px] font-bold text-foreground/20 uppercase tracking-tighter max-w-xs md:text-right">
            By initializing, you authorize Axiom to perform deterministic
            analysis on the provided telemetry.
          </p>
        </div>
      </div>
    </div>
  );
}
