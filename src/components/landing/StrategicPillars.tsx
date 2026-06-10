"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { 
  Binary, 
  Waves, 
  Cpu, 
  ShieldAlert, 
  Mountain,
  ChevronRight
} from "lucide-react";

const PILLARS = [
  {
    roman: "I",
    icon: Binary,
    color: "var(--truth)",
    title: "Clinical Precision",
    desc: "We replace guesswork with deterministic financial modeling. Every shilling is audited against our five taxonomy gates to ensure zero leakage.",
  },
  {
    roman: "II",
    icon: Waves,
    color: "var(--truth)",
    title: "Sovereign Liquidity",
    desc: "Axiom optimizes your capital for maximum availability. We ensure your assets remain liquid while maintaining their yield-generating potential.",
  },
  {
    roman: "III",
    icon: Cpu,
    color: "var(--opportunity)",
    title: "Skill Multipliers",
    desc: "We prioritize investment in human capital. Our engine identifies high-alpha opportunities for skill acquisition that compound your earning power.",
  },
  {
    roman: "IV",
    icon: ShieldAlert,
    color: "var(--warning)",
    title: "Risk Mitigation",
    desc: "Our automated risk-assessment protocols monitor global and local market trends, shielding your portfolio from systemic institutional failure.",
  },
  {
    roman: "V",
    icon: Mountain,
    color: "var(--foreground)",
    title: "Legacy Architecture",
    desc: "Wealth is more than numbers. We help you build a durable financial legacy through strategic experience-equity and asset compounding.",
  },
];

export function StrategicPillars() {
  const [active, setActive] = useState<number | null>(0);

  return (
    <section className="py-40 px-6 bg-background border-b border-border selection:bg-primary selection:text-primary-foreground relative overflow-hidden">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-grid-white opacity-[0.02] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-32 items-start">
          <div className="sticky top-40 space-y-12">
            <ScrollReveal direction="right">
              <div className="space-y-4">
                <span className="font-mono text-[10px] tracking-[0.5em] text-truth uppercase animate-pulse">
                  Strategic Foundation
                </span>
                <h2 className="font-cormorant text-7xl md:text-9xl text-foreground leading-[0.9]">
                  Why work <br />
                  <span className="italic">with Axiom?</span>
                </h2>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2}>
              <div className="h-px w-24 bg-truth/20" />
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.3}>
              <p className="text-muted-foreground max-w-sm text-lg font-light leading-relaxed">
                At Axiom, we maintain a simple yet rigorous philosophy: Wealth
                is the delta between your earning power and your structural
                leakage.
              </p>
            </ScrollReveal>
          </div>

          <div className="space-y-2 border-t border-border">
            {PILLARS.map((pillar, idx) => (
              <ScrollReveal key={pillar.roman} direction="up" delay={0.1 * idx}>
                <div
                  className={`border-b border-border transition-all duration-700 cursor-pointer group relative overflow-hidden ${
                    active === idx
                      ? "bg-card/40 px-8 py-12 backdrop-blur-md"
                      : "py-10 px-4 hover:bg-card/20"
                  }`}
                  onClick={() => setActive(active === idx ? null : idx)}
                >
                  {/* Subtle Glow Background */}
                  {active === idx && (
                    <div 
                      className="absolute inset-0 opacity-10 blur-3xl pointer-events-none"
                      style={{ background: pillar.color }}
                    />
                  )}

                  <div className="flex items-center gap-12 relative z-10">
                    <div className="flex items-center gap-4">
                      <span className="font-cormorant italic text-2xl text-muted-foreground/20 group-hover:text-muted-foreground/40 transition-colors w-8">
                        {pillar.roman}
                      </span>
                      <pillar.icon 
                        strokeWidth={1.2} 
                        size={32} 
                        style={{ color: pillar.color }}
                        className="drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                      />
                    </div>
                    <h3
                      className={`font-cormorant text-4xl md:text-5xl text-foreground transition-all ${
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
                        ? "max-h-125 opacity-100 mt-12"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-muted-foreground text-xl font-light leading-relaxed max-w-2xl pl-20">
                      {pillar.desc}
                    </p>
                    <div className="mt-12 pl-20 flex items-center gap-4">
                      <button className="text-[10px] font-mono tracking-[0.4em] text-truth hover:text-foreground transition-colors uppercase flex items-center gap-2 group/btn">
                        Clinical Details 
                        <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
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
