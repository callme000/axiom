"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { LandingTerminal } from "@/components/landing/LandingTerminal";
import { RunwaySimulator } from "@/components/landing/RunwaySimulator";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push("/dashboard");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <main className="bg-black text-white min-h-screen font-sans selection:bg-white selection:text-black overflow-x-hidden">
      {/* SECTION 1: THE HERO (The Hook) */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-24 max-w-7xl mx-auto relative overflow-hidden">
        {/* Subtle Radial Gradient Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-1/2 h-screen bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />

        <div className="space-y-12 relative z-10 py-32">
          <div className="inline-block border border-white/20 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.3em] text-white/60 mb-4 animate-in fade-in duration-700">
            Axiom Intelligence Layer // v1.0
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] lg:text-[10rem] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
            Stop tracking <br />
            your expenses. <br />
            It's keeping <br />
            you broke.
          </h1>
          <p className="max-w-2xl text-xl md:text-2xl text-white/60 leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
            Traditional finance relies on passive tracking. Axiom is a
            deterministic engine that forces every shilling into a strict
            return-based taxonomy. Take control of your liquidity.
          </p>
          <div className="pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
            <Link
              href="/signup"
              className="inline-block bg-white text-black px-12 py-6 text-sm font-black uppercase tracking-widest hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Initialize Day Zero
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE PROBLEM (The Pain) */}
      <section className="py-64 px-6 md:px-24 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid md:grid-cols-2 gap-24 items-start">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40 sticky top-32">
            01 // The Systemic Failure
          </div>
          <div className="space-y-12">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-tight">
              Inflation is silent theft. <br />
              Cash is a depreciating liability.
            </h2>
            <p className="text-2xl text-white/60 leading-relaxed font-light">
              If you are leaving your liquidity in an M-Pesa account or a
              zero-interest checking account, you are losing purchasing power
              daily. The Kenyan ecosystem demands strategic deployment, not
              passive saving.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE PHILOSOPHY (The Pivot) */}
      <section className="py-64 px-6 md:px-24 max-w-7xl mx-auto border-t border-white/10 bg-white/5">
        <div className="grid md:grid-cols-2 gap-24 items-start">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40 sticky top-32">
            02 // The Five Taxonomy Gates
          </div>
          <div className="space-y-12">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-tight">
              Axiom rejects <br />
              passive spending.
            </h2>
            <p className="text-2xl text-white/60 leading-relaxed font-light">
              Every outbound transaction must be classified: Is it an Asset, a
              Skill, Leverage, Experience, or Leakage?
            </p>
            <div className="grid grid-cols-1 gap-4 font-mono text-sm">
              {[
                { label: "ASSET", desc: "Capital that generates yield." },
                {
                  label: "SKILL",
                  desc: "Investment in human capital / earning power.",
                },
                {
                  label: "LEVERAGE",
                  desc: "Tools that multiply output per hour.",
                },
                { label: "EXPERIENCE", desc: "High-value memory equity." },
                { label: "LEAKAGE", desc: "Unstructured wealth destruction." },
              ].map((gate) => (
                <div
                  key={gate.label}
                  className="border border-white/10 p-8 flex justify-between items-center group hover:bg-white hover:text-black transition-all cursor-default"
                >
                  <span className="font-black tracking-widest text-lg">
                    {gate.label}
                  </span>
                  <span className="text-[10px] opacity-40 group-hover:opacity-100 transition-opacity uppercase text-right ml-4">
                    {gate.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: THE SIMULATOR (Interactive Hook) */}
      <section className="py-64 px-6 md:px-24 max-w-7xl mx-auto border-t border-white/10 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />
        <div className="grid md:grid-cols-2 gap-24 items-center relative z-10">
          <div className="space-y-12">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
              03 // Operational Runway
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-tight">
              Calculate your <br />
              structural <br />
              solvency.
            </h2>
            <p className="text-2xl text-white/60 leading-relaxed font-light">
              How long would you survive if your primary income stream collapsed
              today? Axiom's deterministic engine measures your runway with
              clinical precision.
            </p>
          </div>
          <div>
            <RunwaySimulator />
          </div>
        </div>
      </section>

      {/* SECTION 5: THE ENGINE (The Proof / Terminal) */}
      <section className="py-64 px-6 md:px-24 max-w-7xl mx-auto border-t border-white/10 relative">
        <div className="absolute inset-0 bg-white/[0.01] pointer-events-none" />
        <div className="grid md:grid-cols-2 gap-24 items-center relative z-10">
          <div className="space-y-12">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
              04 // Kairos Intelligence
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-tight">
              Meet Kairos. <br />
              Your clinical <br />
              financial analyst.
            </h2>
            <p className="text-2xl text-white/60 leading-relaxed font-light">
              No hallucinations. Just clinical, mathematical truth about your
              structural solvency and income concentration. Watch Kairos audit a
              sample deployment in real-time.
            </p>
          </div>
          <div>
            <LandingTerminal />
          </div>
        </div>
      </section>

      {/* SECTION 6: FINAL CTA */}
      <section className="py-64 px-6 md:px-24 text-center border-t border-white/10 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto space-y-16">
          <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.9]">
            Ready to deploy <br />
            your capital?
          </h2>
          <div className="flex flex-col items-center gap-12">
            <Link
              href="/signup"
              className="inline-block bg-white text-black px-16 py-8 text-sm font-black uppercase tracking-widest hover:bg-white/90 transition-all hover:scale-[1.05] active:scale-[0.95] shadow-[0_0_50px_rgba(255,255,255,0.1)]"
            >
              Establish Your Baseline
            </Link>
            <div className="h-32 w-[1px] bg-gradient-to-b from-white/20 to-transparent" />
            <div className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/20">
              Axiom // Strategic Solvency Protocol
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 md:px-24 border-t border-white/5 text-[10px] font-mono text-white/20 uppercase tracking-widest flex flex-col md:flex-row justify-between items-center gap-8">
        <div>© 2026 Axiom Labs // All Rights Reserved</div>
        <div className="flex gap-8">
          <span>Encrypted Session</span>
          <span>Kenya Ecosystem Optimized</span>
        </div>
      </footer>
    </main>
  );
}
