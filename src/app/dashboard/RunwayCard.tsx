"use client";

import React from "react";

interface RunwayCardProps {
  runwayDays: number | null;
  netWorth?: number;
}

export function RunwayCard({ runwayDays, netWorth = 0 }: RunwayCardProps) {
  // 1. Logic for determining visual state
  const isStable = runwayDays === null;
  const isCritical = !isStable && runwayDays! < 30;
  const isInsolvent = netWorth < 0;

  // 2. Formatting
  const displayValue = isStable
    ? isInsolvent
      ? "INSOLVENT STABLE"
      : "SYSTEM STABLE"
    : `${runwayDays!.toFixed(0)} DAYS`;

  // 3. Conditional Styles
  const containerClasses = `bg-foreground/5 border rounded-2xl p-6 md:p-8 flex flex-col justify-between transition-all duration-500 ${
    isStable
      ? isInsolvent
        ? "border-rose-500/20"
        : "border-emerald-500/10"
      : isCritical
        ? "border-rose-500/30 bg-rose-500/5 shadow-inner"
        : "border-foreground/10"
  }`;

  const labelClasses = `text-[11px] font-black uppercase tracking-[0.2em] mb-4 ${
    isStable
      ? isInsolvent
        ? "text-rose-500/50"
        : "text-emerald-500/50"
      : isCritical
        ? "text-rose-500/60"
        : "text-foreground/40"
  }`;

  const valueClasses = `text-4xl font-black tabular-nums transition-colors duration-500 ${
    isStable
      ? isInsolvent
        ? "text-rose-500/80 font-mono tracking-tighter"
        : "text-emerald-500/80 font-mono tracking-tighter"
      : isCritical
        ? "text-rose-600"
        : "text-foreground"
  }`;

  const description = isStable
    ? isInsolvent
      ? "Burn is absorbed by income, but total liabilities exceed assets."
      : "Net inbound capital completely absorbs current burn rates."
    : isCritical
      ? "High acceleration of capital consumption detected."
      : "Operational survival window based on burn.";

  return (
    <div className={containerClasses}>
      <div className="flex items-center justify-between mb-4">
        <span className={labelClasses}>
          {isStable
            ? isInsolvent
              ? "Insolvent Stability"
              : "Infinite Stability"
            : "Deterministic Runway"}
        </span>
        {isStable && !isInsolvent && (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500/40 rounded-full animate-pulse"></span>
            <span className="text-[8px] font-black text-emerald-500/40 uppercase tracking-widest">
              Active Protection
            </span>
          </div>
        )}
        {isStable && isInsolvent && (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-rose-500/40 rounded-full animate-pulse"></span>
            <span className="text-[8px] font-black text-rose-500/40 uppercase tracking-widest">
              Solvency Risk
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <span className={valueClasses}>{displayValue}</span>
        <p
          className={`text-[10px] font-bold uppercase tracking-widest mt-4 ${
            isStable ? "text-emerald-600/40" : "text-foreground/40"
          }`}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
