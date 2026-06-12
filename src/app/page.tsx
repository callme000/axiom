"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { LandingTerminal } from "@/components/landing/LandingTerminal";
import { SolvencyCalculator } from "@/components/landing/SolvencyCalculator";
import { StrategicPillars } from "@/components/landing/StrategicPillars";
import { ProcessFlow } from "@/components/landing/ProcessFlow";
import { BrandMark } from "@/components/ui/brand-mark";
import { Zap, Activity, Cpu, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push("/dashboard");
      }
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <main className="bg-[#000000] text-foreground min-h-screen selection:bg-white selection:text-black overflow-x-hidden antialiased font-mono">
      {/* Editorial Navigation - Clinical & Functional */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 px-4 md:px-8 flex justify-between items-center transition-all duration-300 ${
          isScrolled
            ? "py-4 bg-black/90 border-b border-white/10 backdrop-blur-md"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="flex items-center gap-3 md:gap-4 cursor-pointer">
          <BrandMark className="w-8 h-8 md:w-10 md:h-10 text-white" />
          <div className="flex flex-col">
            <span className="font-bold text-[10px] tracking-[0.6em] uppercase text-white">
              AXIOM
            </span>
            <span className="text-[7px] tracking-[0.3em] uppercase text-zinc-500">
              Sovereign Intelligence Unit
            </span>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/signup">
            <button className="px-6 py-2 border border-white/10 text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-all flex items-center gap-2">
              <Zap size={12} />
              Initialize
            </button>
          </Link>
        </div>
      </nav>

      {/* ASSEMBLY */}
      <div className="relative z-10 pt-32">
        {/* HERO TERMINAL SECTION */}
        <section className="min-h-[80vh] flex flex-col justify-center items-center px-6 text-center space-y-16">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-4 text-zinc-500">
              <div className="h-px w-8 bg-zinc-800" />
              <span className="text-[9px] tracking-[0.8em] uppercase">
                System Status: Operational
              </span>
              <div className="h-px w-8 bg-zinc-800" />
            </div>
            <h1 className="text-4xl md:text-7xl font-bold tracking-tighter text-white uppercase leading-none">
              Deterministic <br />
              <span className="text-zinc-500">Wealth Architecture.</span>
            </h1>
            <p className="max-w-xl mx-auto text-zinc-400 text-sm md:text-base tracking-tight leading-relaxed">
              Clinical financial intelligence for elite operators. 
              Secure your structural solvency with sovereign precision.
            </p>
          </div>

          <LandingTerminal />

          <div className="flex flex-col md:flex-row gap-4">
            <Link href="/signup">
              <button className="px-12 py-4 bg-white text-black font-bold text-[10px] tracking-widest uppercase hover:bg-zinc-200 transition-all">
                Establish Baseline
              </button>
            </Link>
            <button 
              onClick={() => document.getElementById("architecture")?.scrollIntoView({ behavior: "smooth" })}
              className="px-12 py-4 border border-white/10 text-white font-bold text-[10px] tracking-widest uppercase hover:bg-white/5 transition-all"
            >
              System Specs →
            </button>
          </div>
        </section>

        <div id="architecture">
          <SolvencyCalculator />
          <StrategicPillars />
          <ProcessFlow />
        </div>

        {/* FINAL CONVERSION SECTION - CLINICAL */}
        <section className="py-40 md:py-60 px-6 text-center bg-black border-t border-white/5">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-4">
              <span className="text-[9px] tracking-[1em] text-zinc-500 uppercase">
                End of Transmission
              </span>
              <h2 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter">
                Deploy Your <br />
                <span className="text-zinc-600">Sovereign Protocol.</span>
              </h2>
            </div>

            <Link href="/signup">
              <button className="px-16 py-6 bg-white text-black font-bold text-[11px] tracking-[0.2em] uppercase hover:bg-zinc-200 transition-all">
                Initialize Access Portal
              </button>
            </Link>
          </div>
        </section>

        {/* TERMINAL FOOTER */}
        <footer className="py-20 px-6 md:px-24 border-t border-white/10 bg-black">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <BrandMark className="w-8 h-8 text-white" />
                <span className="text-xs tracking-[0.5em] uppercase font-bold text-white">
                  AXIOM
                </span>
              </div>
              <div className="space-y-4 text-zinc-500 text-[11px] leading-relaxed uppercase tracking-tight">
                <p>Node: Nairobi // Instance: 2026.06.12</p>
                <p>Deterministic Financial Intelligence for the Sovereign Individual.</p>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] tracking-[0.4em] uppercase text-white font-bold">
                Protocols
              </h4>
              <div className="flex flex-col gap-4 text-[10px] tracking-widest uppercase text-zinc-600">
                <Link href="#" className="hover:text-white transition-colors">Methodology</Link>
                <Link href="#" className="hover:text-white transition-colors">Taxonomy</Link>
                <Link href="#" className="hover:text-white transition-colors">Risk Engine</Link>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] tracking-[0.4em] uppercase text-white font-bold">
                Verification
              </h4>
              <div className="flex flex-col gap-4 text-[10px] tracking-widest uppercase text-zinc-600">
                <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                <Link href="#" className="hover:text-white transition-colors">Audit log</Link>
              </div>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] tracking-[0.3em] uppercase text-zinc-700 font-mono">
            <span>© 2026 Axiom Strategic Units</span>
            <div className="flex gap-8">
              <span className="flex items-center gap-2"><Activity size={10} /> Network: Stable</span>
              <span className="flex items-center gap-2"><ShieldCheck size={10} /> Encryption: active</span>
              <span className="flex items-center gap-2"><Cpu size={10} /> Engine: Kairos v1.1</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
