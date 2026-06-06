"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const PILLARS = [
  {
    roman: "I",
    title: "Clinical Precision",
    desc: "We replace guesswork with deterministic financial modeling. Every shilling is audited against our five taxonomy gates to ensure zero leakage.",
  },
  {
    roman: "II",
    title: "Sovereign Liquidity",
    desc: "Axiom optimizes your capital for maximum availability. We ensure your assets remain liquid while maintaining their yield-generating potential.",
  },
  {
    roman: "III",
    title: "Skill Multipliers",
    desc: "We prioritize investment in human capital. Our engine identifies high-alpha opportunities for skill acquisition that compound your earning power.",
  },
  {
    roman: "IV",
    title: "Risk Mitigation",
    desc: "Our automated risk-assessment protocols monitor global and local market trends, shielding your portfolio from systemic institutional failure.",
  },
  {
    roman: "V",
    title: "Legacy Architecture",
    desc: "Wealth is more than numbers. We help you build a durable financial legacy through strategic experience-equity and asset compounding.",
  },
];

export function StrategicPillars() {
  const [active, setActive] = useState<number | null>(0);

  return (
    <section className="py-40 px-6 bg-black border-b border-white/5 selection:bg-white selection:text-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-32 items-start">
          <div className="sticky top-40 space-y-12">
            <ScrollReveal direction="right">
              <div className="space-y-4">
                <span className="font-mono text-[10px] tracking-[0.5em] text-white/20 uppercase">
                  Strategic Foundation
                </span>
                <h2 className="font-cormorant text-7xl md:text-9xl text-white leading-[0.9]">
                  Why work <br />
                  <span className="italic">with Axiom?</span>
                </h2>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2}>
              <div className="h-[1px] w-24 bg-white/20" />
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.3}>
              <p className="text-white/40 max-w-sm text-lg font-light leading-relaxed">
                At Axiom, we maintain a simple yet rigorous philosophy: Wealth
                is the delta between your earning power and your structural
                leakage.
              </p>
            </ScrollReveal>
          </div>

          <div className="space-y-2 border-t border-white/10">
            {PILLARS.map((pillar, idx) => (
              <ScrollReveal key={pillar.roman} direction="up" delay={0.1 * idx}>
                <div
                  className={`border-b border-white/10 transition-all duration-700 cursor-pointer group ${
                    active === idx
                      ? "bg-white/[0.02] px-8 py-12"
                      : "py-10 px-4 hover:bg-white/[0.01]"
                  }`}
                  onClick={() => setActive(active === idx ? null : idx)}
                >
                  <div className="flex items-center gap-12">
                    <span className="font-cormorant italic text-3xl text-white/10 group-hover:text-white/30 transition-colors">
                      {pillar.roman}.
                    </span>
                    <h3
                      className={`font-cormorant text-4xl md:text-5xl text-white transition-all ${
                        active === idx
                          ? "italic translate-x-2"
                          : "group-hover:translate-x-2"
                      }`}
                    >
                      {pillar.title}
                    </h3>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-700 ease-in-out ${
                      active === idx
                        ? "max-h-[500px] opacity-100 mt-12"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-white/40 text-xl font-light leading-relaxed max-w-2xl pl-20">
                      {pillar.desc}
                    </p>
                    <div className="mt-12 pl-20">
                      <button className="text-[10px] font-mono tracking-[0.4em] text-white/60 hover:text-white transition-colors uppercase">
                        Learn More →
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
