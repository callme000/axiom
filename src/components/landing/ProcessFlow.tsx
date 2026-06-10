"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { 
  Search, 
  Layers, 
  Activity, 
  Sparkles 
} from "lucide-react";

const STEPS = [
  {
    roman: "I",
    icon: Search,
    color: "var(--truth)",
    title: "Initial Consultation",
    desc: "We begin with a deep-dive audit of your current financial architecture, identifying hidden liabilities and leakage points.",
  },
  {
    roman: "II",
    icon: Layers,
    color: "var(--truth)",
    title: "Taxonomy Deployment",
    desc: "Every transaction stream is mapped to our five gates. We build a deterministic model of your capital flow.",
  },
  {
    roman: "III",
    icon: Activity,
    color: "var(--opportunity)",
    title: "Structural Optimization",
    desc: "We reorganize your assets and liabilities to maximize liquidity and secure your long-term structural solvency.",
  },
  {
    roman: "IV",
    icon: Sparkles,
    color: "var(--truth)",
    title: "Continuous Intelligence",
    desc: "Kairos, our AI analyst, monitors your portfolio 24/7, providing clinical insights and suggesting high-alpha pivots.",
  },
];

export function ProcessFlow() {
  return (
    <section className="py-40 px-6 bg-background relative overflow-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Editorial Decorative Layer */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-8 mb-32">
          <ScrollReveal direction="up">
            <span className="font-mono text-[10px] tracking-[0.6em] text-truth uppercase animate-pulse">
              The Methodology
            </span>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2}>
            <h2 className="font-cormorant text-7xl md:text-9xl text-foreground">
              Operational <span className="italic">Process.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.4}>
            <div className="w-px h-24 bg-linear-to-b from-truth/20 to-transparent mx-auto" />
          </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-3xl overflow-hidden shadow-2xl">
          {STEPS.map((step, idx) => (
            <ScrollReveal
              key={step.roman}
              direction="up"
              delay={0.1 * idx}
              distance={20}
            >
              <div className="bg-card h-full p-12 md:p-16 space-y-12 group hover:bg-primary transition-all duration-700 cursor-default relative overflow-hidden">
                {/* Hover Icon Glow */}
                <div 
                  className="absolute -top-20 -right-20 w-40 h-40 opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-700 pointer-events-none"
                  style={{ background: step.color }}
                />

                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-start">
                    <span className="font-cormorant italic text-2xl text-muted-foreground/50 group-hover:text-primary-foreground/20 transition-colors">
                      {step.roman}
                    </span>
                    <step.icon 
                      strokeWidth={1} 
                      size={40} 
                      className="text-truth group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-700"
                    />
                  </div>
                  <h3 className="font-cormorant text-3xl text-foreground group-hover:text-primary-foreground transition-colors leading-tight">
                    {step.title}
                  </h3>
                </div>

                <div className="h-px w-12 bg-truth/20 group-hover:bg-primary-foreground/20 group-hover:w-full transition-all duration-700" />

                <p className="text-muted-foreground group-hover:text-primary-foreground/70 text-lg font-light leading-relaxed transition-colors">
                  {step.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Final Manifest Quote */}
        <div className="mt-40 text-center max-w-4xl mx-auto space-y-12">
          <ScrollReveal direction="up">
            <div className="h-px w-24 bg-border mx-auto" />
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2}>
            <h3 className="font-cormorant text-4xl md:text-6xl text-foreground italic leading-snug">
              &quot;Sovereignty is the ultimate asset. Precision is the ultimate
              weapon.&quot;
            </h3>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.4}>
            <p className="text-muted-foreground/50 font-mono text-[10px] tracking-[0.5em] uppercase">
              Axiom Strategic Wealth Intelligence
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
