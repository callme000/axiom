"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Cpu, Database, Brain, Zap } from "lucide-react";

const STEPS = [
  {
    icon: Database,
    title: "Ingestion",
    desc: "Authorize the system to index your capital flows. M-Pesa, MMF, and SACCO logs are ingested into the private ledger.",
  },
  {
    icon: Cpu,
    title: "Taxonomy",
    desc: "Automated classification of every shilling. Axiom identifies the strategic intent behind every transaction.",
  },
  {
    icon: Brain,
    title: "Inference",
    desc: "The Kairos Engine simulates survival windows and calculates the strategic cost of behavioral leakage.",
  },
  {
    icon: Zap,
    title: "Deployment",
    desc: "Execute the optimized protocol. Align your liquidity with high-order objectives for maximum yield.",
  },
];

export function ProcessFlow() {
  return (
    <section className="py-40 px-6 bg-black font-mono">
      <div className="max-w-7xl mx-auto space-y-32">
        <ScrollReveal direction="up" distance={20}>
          <div className="space-y-4">
            <span className="text-[10px] tracking-[0.8em] text-truth uppercase font-bold">
              Operational Cycle
            </span>
            <h2 className="text-6xl md:text-9xl font-bold text-white uppercase tracking-tighter">
              The <span className="text-zinc-700">Protocol.</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, i) => (
            <ScrollReveal
              key={step.title}
              direction="up"
              distance={20}
              delay={i * 0.15}
            >
              <div className="group space-y-8 p-8 border border-white/5 bg-[#0a0a0a] hover:border-white/20 transition-all duration-500 h-full">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-zinc-950 border border-white/5 group-hover:border-truth/30 transition-colors">
                    <step.icon strokeWidth={1.5} size={24} className="text-truth" />
                  </div>
                  <span className="text-sm font-bold text-zinc-800">0{i + 1}</span>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-zinc-500 text-xs leading-relaxed tracking-tight group-hover:text-zinc-400 transition-colors">
                    {step.desc}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal direction="up" distance={20} delay={0.6}>
          <div className="p-12 md:p-20 bg-zinc-950 border border-white/5 text-center space-y-12">
            <h3 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tighter leading-tight max-w-3xl mx-auto">
              Sovereign wealth is not tracked; <br />
              <span className="text-zinc-600 italic font-serif normal-case font-light">it is architected.</span>
            </h3>
            <button className="px-12 py-4 border border-white/10 text-white font-bold text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-all">
              Initialize Protocol Access
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
