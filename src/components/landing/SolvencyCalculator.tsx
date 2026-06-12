"use client";

import { useState, useMemo } from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function SolvencyCalculator() {
  const [balance, setBalance] = useState(500000);
  const [burn, setBurn] = useState(80000);

  const runway = useMemo(() => {
    if (burn === 0) return 99;
    const months = balance / burn;
    return months > 99 ? 99 : Math.floor(months);
  }, [balance, burn]);

  const formattedBalance = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(balance);

  const formattedBurn = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(burn);

  return (
    <section className="py-32 px-6 bg-black font-mono">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-center">
        {/* INPUTS */}
        <ScrollReveal direction="left" distance={20}>
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-[10px] tracking-[0.8em] text-truth uppercase font-bold">
                Simulation Engine
              </span>
              <h2 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tighter leading-none">
                Calculate your <br />
                <span className="text-zinc-600">Survival Window.</span>
              </h2>
            </div>

            <div className="space-y-16">
              <div className="space-y-8">
                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                  <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-bold">
                    Liquid Architecture
                  </span>
                  <span className="text-2xl font-bold text-white tabular-nums">
                    {formattedBalance}
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="5000000"
                  step="50000"
                  value={balance}
                  onChange={(e) => setBalance(parseInt(e.target.value))}
                  className="w-full accent-white"
                />
              </div>

              <div className="space-y-8">
                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                  <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-bold">
                    Structural Burn (Monthly)
                  </span>
                  <span className="text-2xl font-bold text-white tabular-nums">
                    {formattedBurn}
                  </span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="1000000"
                  step="10000"
                  value={burn}
                  onChange={(e) => setBurn(parseInt(e.target.value))}
                  className="w-full accent-white"
                />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* RESULT */}
        <ScrollReveal direction="right" distance={20} delay={0.3}>
          <div className="relative p-12 bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden">
            {/* Background Data Matrix */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            
            <div className="relative z-10 space-y-10">
              <div className="space-y-1">
                <p className="text-[10px] tracking-[0.5em] text-zinc-500 uppercase font-bold">
                  Computed Solvency
                </p>
                <div className="flex items-baseline gap-4">
                  <span className="text-[10rem] md:text-[12rem] font-bold text-truth leading-none tracking-tighter">
                    {runway}
                  </span>
                  <span className="text-3xl font-bold text-zinc-700 uppercase tracking-widest">
                    Months
                  </span>
                </div>
              </div>

              <div className="pt-12 border-t border-white/10 space-y-10">
                <p className="text-zinc-500 text-xs leading-relaxed max-w-sm uppercase tracking-tight">
                  This projection is based on your current liquid architecture. 
                  Axiom provides the technical units to optimize these
                  variables and extend your survival window indefinitely.
                </p>

                <button className="w-full py-6 bg-white text-black font-bold text-[10px] tracking-[0.4em] uppercase hover:bg-zinc-200 transition-all">
                  Initialize Baseline Architecture
                </button>

                <p className="text-[9px] text-zinc-800 uppercase tracking-widest text-center">
                  * Clinical mathematical truth // engine: kairos
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
