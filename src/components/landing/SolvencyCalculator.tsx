"use client";

import { useState, useMemo } from "react";
import { RippleButton } from "@/components/ui/multi-type-ripple-buttons";
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
    <section
      id="calculator"
      className="py-40 px-6 bg-[#050505] border-y border-white/5 relative overflow-hidden"
    >
      {/* Background Detail */}
      <div className="absolute top-0 right-0 w-[40%] h-full bg-linear-to-l from-white/1 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-24 items-center">
        <ScrollReveal direction="right" delay={0.2}>
          <div>
            <h2 className="font-cormorant text-6xl md:text-8xl text-white mb-12 leading-[0.9]">
              Measure your <br />
              <span className="italic">structural solvency.</span>
            </h2>

            <div className="space-y-16 mt-20">
              {/* Input 1 */}
              <div className="space-y-8 group">
                <div className="flex justify-between items-end border-b border-white/10 pb-4 transition-colors group-hover:border-white/20">
                  <label className="text-white/30 font-mono text-[10px] uppercase tracking-[0.4em]">
                    Total Liquid Assets
                  </label>
                  <span className="font-cormorant text-4xl text-white">
                    {formattedBalance}
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="10000000"
                  step="50000"
                  value={balance}
                  onChange={(e) => setBalance(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[9px] text-white/10 font-mono uppercase tracking-widest">
                  <span>KES 50K</span>
                  <span>KES 10M+</span>
                </div>
              </div>

              {/* Input 2 */}
              <div className="space-y-8 group">
                <div className="flex justify-between items-end border-b border-white/10 pb-4 transition-colors group-hover:border-white/20">
                  <label className="text-white/30 font-mono text-[10px] uppercase tracking-[0.4em]">
                    Monthly Deployment
                  </label>
                  <span className="font-cormorant text-4xl text-white">
                    {formattedBurn}
                  </span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="2000000"
                  step="10000"
                  value={burn}
                  onChange={(e) => setBurn(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[9px] text-white/10 font-mono uppercase tracking-widest">
                  <span>KES 10K</span>
                  <span>KES 2M+</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Results Card */}
        <ScrollReveal direction="left" delay={0.4}>
          <div className="relative group">
            <div className="absolute -inset-4 bg-white/2 blur-3xl rounded-full group-hover:bg-white/4 transition-all duration-1000" />

            <div className="relative bg-[#0a0a0a] border border-white/10 p-16 md:p-24 space-y-12 rounded-3xl overflow-hidden">
              {/* Roman Decoration */}
              <div className="absolute top-0 right-0 p-8 font-cormorant italic text-white/5 text-[12rem] leading-none select-none pointer-events-none">
                II
              </div>

              <div>
                <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.5em] mb-4">
                  Deterministic Runway
                </p>
                <div className="flex items-baseline gap-4">
                  <span className="font-cormorant text-[10rem] md:text-[12rem] text-white leading-none tracking-tighter">
                    {runway}
                  </span>
                  <span className="font-cormorant italic text-4xl text-white/20">
                    Months
                  </span>
                </div>
              </div>

              <div className="pt-12 border-t border-white/5 space-y-10">
                <p className="text-white/50 text-sm leading-relaxed font-light max-w-sm">
                  This projection is based on your current liquidity
                  architecture. Axiom provides the tools to optimize these
                  variables and extend your runway indefinitely.
                </p>

                <RippleButton className="w-full py-6 text-xs">
                  Establish Baseline Architecture
                </RippleButton>

                <p className="text-[9px] font-mono text-white/10 uppercase tracking-widest text-center italic">
                  * Estimated from clinical mathematical truth
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
