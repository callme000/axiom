"use client";

import { useState, useMemo } from "react";

export function RunwaySimulator() {
  const [liquidity, setLiquidity] = useState(50000);
  const [monthlyBurn, setMonthlyBurn] = useState(30000);

  const runwayResult = useMemo(() => {
    if (monthlyBurn <= 0) return { months: 99, days: 0, isInfinite: true };

    const totalMonths = liquidity / monthlyBurn;
    const months = Math.floor(totalMonths);
    const days = Math.round((totalMonths - months) * 30);

    return { months, days, isInfinite: false };
  }, [liquidity, monthlyBurn]);

  const getVerdict = () => {
    const totalMonths = runwayResult.isInfinite
      ? 99
      : runwayResult.months + runwayResult.days / 30;
    if (totalMonths < 3) {
      return {
        label: "CRITICAL",
        text: "Severe solvency risk. Capital depletion imminent.",
        color: "text-orange-500",
      };
    }
    if (totalMonths >= 3 && totalMonths < 6) {
      return {
        label: "ADVISORY",
        text: "Fragile runway. One systemic shock away from illiquidity.",
        color: "text-white/60",
      };
    }
    return {
      label: "OBSERVATION",
      text: "Runway stable. Capital ready for strategic deployment.",
      color: "text-emerald-500/80",
    };
  };

  const verdict = getVerdict();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-12 p-8 md:p-12 border border-white/10 bg-[#050505] rounded-2xl relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] blur-3xl rounded-full" />

      <div className="space-y-8 relative z-10">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
              Operational Variable 01
            </div>
            <div className="text-sm font-black uppercase tracking-widest">
              Available Liquidity
            </div>
          </div>
          <div className="font-mono text-2xl font-bold">
            {formatCurrency(liquidity)}
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="1000000"
          step="5000"
          value={liquidity}
          onChange={(e) => setLiquidity(Number(e.target.value))}
          className="w-full h-[1px] bg-white/20 appearance-none cursor-crosshair accent-white"
        />
      </div>

      <div className="space-y-8 relative z-10">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
              Operational Variable 02
            </div>
            <div className="text-sm font-black uppercase tracking-widest">
              Monthly Burn Rate
            </div>
          </div>
          <div className="font-mono text-2xl font-bold">
            {formatCurrency(monthlyBurn)}
          </div>
        </div>
        <input
          type="range"
          min="1000"
          max="500000"
          step="1000"
          value={monthlyBurn}
          onChange={(e) => setMonthlyBurn(Number(e.target.value))}
          className="w-full h-[1px] bg-white/20 appearance-none cursor-crosshair accent-white"
        />
      </div>

      <div className="pt-8 border-t border-white/5 space-y-6">
        <div className="flex justify-between items-baseline">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
            Calculated Outcome
          </div>
          <div className="text-4xl font-black font-mono tracking-tighter flex items-baseline gap-2">
            {runwayResult.isInfinite ? (
              "∞"
            ) : (
              <>
                <span>{runwayResult.months}</span>
                <span className="text-xs uppercase tracking-widest text-white/40">
                  Months
                </span>
                {runwayResult.days > 0 && (
                  <>
                    <span className="ml-2">{runwayResult.days}</span>
                    <span className="text-xs uppercase tracking-widest text-white/40">
                      Days
                    </span>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <div
          className={`p-6 border border-white/5 bg-white/[0.02] font-mono text-xs leading-relaxed space-y-2 animate-in fade-in slide-in-from-top-1 duration-500`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-1.5 h-1.5 rounded-full animate-pulse ${verdict.label === "CRITICAL" ? "bg-orange-500" : verdict.label === "ADVISORY" ? "bg-white/40" : "bg-emerald-500"}`}
            />
            <span className={`font-black tracking-[0.2em] ${verdict.color}`}>
              {verdict.label}
            </span>
          </div>
          <div className="text-white/60">{verdict.text}</div>
        </div>
      </div>

      <div className="absolute bottom-4 right-8 text-[8px] font-mono uppercase tracking-[0.4em] text-white/10">
        Deterministic Solver v0.4
      </div>
    </div>
  );
}
