"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Shield, Target, Zap, Activity } from "lucide-react";

const PILLARS = [
  {
    icon: Shield,
    title: "Structural Solvency",
    desc: "Deterministic modeling to ensure your liquid architecture remains impenetrable to market volatility and erratic flows.",
    color: "text-truth",
  },
  {
    icon: Target,
    title: "Strategic Alignment",
    desc: "Dynamic mapping of capital deployment to higher-order objectives. Every shilling must serve a tactical purpose.",
    color: "text-truth",
  },
  {
    icon: Zap,
    title: "Velocity Optimization",
    desc: "Calculating the replenishment speed of your capital pool. Optimizing yield cycles for maximum deployment capacity.",
    color: "text-warning",
  },
  {
    icon: Activity,
    title: "Behavioral Auditing",
    desc: "The Kairos Engine continuously monitors transaction taxonomy, identifying leakage and enforcing operational discipline.",
    color: "text-opportunity",
  },
];

export function StrategicPillars() {
  return (
    <section className="py-40 px-6 bg-black font-mono">
      <div className="max-w-7xl mx-auto space-y-32">
        {/* HEADER */}
        <ScrollReveal direction="up" distance={20}>
          <div className="flex flex-col md:flex-row items-end justify-between gap-12">
            <h2 className="text-6xl md:text-9xl font-bold text-white uppercase tracking-tighter leading-none">
              Strategic <br />
              <span className="text-zinc-700">Pillars.</span>
            </h2>
            <div className="max-w-sm space-y-6">
              <p className="text-zinc-500 text-xs tracking-tight uppercase leading-relaxed">
                Axiom is built on four core technical units designed to provide 
                absolute financial sovereignty in any ecosystem.
              </p>
              <div className="h-px w-full bg-white/10" />
            </div>
          </div>
        </ScrollReveal>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10">
          {PILLARS.map((pillar, i) => (
            <ScrollReveal
              key={pillar.title}
              direction="up"
              distance={20}
              delay={i * 0.1}
            >
              <div className="group p-12 md:p-20 bg-black hover:bg-zinc-900 transition-all duration-500 space-y-12 h-full">
                <div className="flex items-start justify-between">
                  <div className={`p-4 border border-white/5 bg-zinc-950 transition-colors group-hover:border-${pillar.color.split("-")[1]}/30`}>
                    <pillar.icon strokeWidth={1.5} size={32} className={pillar.color} />
                  </div>
                  <span className="text-2xl font-bold text-zinc-800 group-hover:text-zinc-600 transition-colors">
                    0{i + 1}
                  </span>
                </div>
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-white uppercase tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed tracking-tight group-hover:text-zinc-400 transition-colors">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
