"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";

const STEPS = [
  {
    roman: "I",
    title: "Initial Consultation",
    desc: "We begin with a deep-dive audit of your current financial architecture, identifying hidden liabilities and leakage points.",
  },
  {
    roman: "II",
    title: "Taxonomy Deployment",
    desc: "Every transaction stream is mapped to our five gates. We build a deterministic model of your capital flow.",
  },
  {
    roman: "III",
    title: "Structural Optimization",
    desc: "We reorganize your assets and liabilities to maximize liquidity and secure your long-term structural solvency.",
  },
  {
    roman: "IV",
    title: "Continuous Intelligence",
    desc: "Kairos, our AI analyst, monitors your portfolio 24/7, providing clinical insights and suggesting high-alpha pivots.",
  },
];

export function ProcessFlow() {
  return (
    <section className="py-40 px-6 bg-[#050505] relative overflow-hidden selection:bg-white selection:text-black">
      {/* Editorial Decorative Layer */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-8 mb-32">
          <ScrollReveal direction="up">
            <span className="font-mono text-[10px] tracking-[0.6em] text-white/20 uppercase">
              The Methodology
            </span>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2}>
            <h2 className="font-cormorant text-7xl md:text-9xl text-white">
              Operational <span className="italic">Process.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.4}>
            <div className="w-[1px] h-24 bg-gradient-to-b from-white/20 to-transparent mx-auto" />
          </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
          {STEPS.map((step, idx) => (
            <ScrollReveal
              key={step.roman}
              direction="up"
              delay={0.1 * idx}
              distance={20}
            >
              <div className="bg-[#050505] h-full p-12 md:p-16 space-y-12 group hover:bg-white transition-all duration-700 cursor-default">
                <div className="space-y-4">
                  <span className="font-cormorant italic text-6xl text-white/10 group-hover:text-black/10 transition-colors">
                    {step.roman}.
                  </span>
                  <h3 className="font-cormorant text-3xl text-white group-hover:text-black transition-colors leading-tight">
                    {step.title}
                  </h3>
                </div>

                <div className="h-[1px] w-12 bg-white/20 group-hover:bg-black/20 group-hover:w-full transition-all duration-700" />

                <p className="text-white/40 group-hover:text-black/60 text-lg font-light leading-relaxed transition-colors">
                  {step.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Final Manifest Quote */}
        <div className="mt-40 text-center max-w-4xl mx-auto space-y-12">
          <ScrollReveal direction="up">
            <div className="h-[1px] w-24 bg-white/10 mx-auto" />
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2}>
            <h3 className="font-cormorant text-4xl md:text-6xl text-white italic leading-snug">
              &quot;Sovereignty is the ultimate asset. Precision is the ultimate
              weapon.&quot;
            </h3>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.4}>
            <p className="text-white/20 font-mono text-[10px] tracking-[0.5em] uppercase">
              Axiom Strategic Wealth Intelligence
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
