"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { LuxuryHero } from "@/components/landing/LuxuryHero";
import { SolvencyCalculator } from "@/components/landing/SolvencyCalculator";
import { StrategicPillars } from "@/components/landing/StrategicPillars";
import { ProcessFlow } from "@/components/landing/ProcessFlow";

import { RippleButton } from "@/components/ui/multi-type-ripple-buttons";
import { HoverButton } from "@/components/ui/hover-glow-button";
import { BrandMark } from "@/components/ui/brand-mark";

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
    <main className="bg-black text-white min-h-screen selection:bg-white selection:text-black overflow-x-hidden antialiased">
      {/* Editorial Navigation - Dynamic Glassmorphism */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 px-8 flex justify-between items-center transition-all duration-700 ${
          isScrolled
            ? "py-5 bg-black/40 backdrop-blur-xl border-b border-white/5 shadow-2xl"
            : "py-10 bg-transparent border-b border-transparent"
        }`}
      >
        <div className="flex items-center gap-4 group cursor-pointer">
          <BrandMark />
          <div className="flex flex-col">
            <span className="font-mono text-[10px] tracking-[0.6em] uppercase font-bold text-white">
              AXIOM
            </span>
            <span className="text-[7px] font-mono tracking-[0.3em] uppercase text-white/40">
              Sovereign Intel
            </span>
          </div>
        </div>
        <div className="flex gap-8 items-center">
          <Link href="/signup">
            <RippleButton
              variant="ghost"
              className="text-white/40 hover:text-white"
            >
              Access Portal
            </RippleButton>
          </Link>
          <Link href="/signup">
            <RippleButton
              variant="hoverborder"
              hoverBorderEffectColor="rgba(255,255,255,0.4)"
            >
              Initialize
            </RippleButton>
          </Link>
        </div>
      </nav>

      {/* ASSEMBLY */}
      <LuxuryHero />
      <SolvencyCalculator />
      <StrategicPillars />
      <ProcessFlow />

      {/* FINAL CONVERSION SECTION */}
      <section className="py-80 px-6 text-center bg-gradient-to-b from-black to-[#080808] relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-24 relative z-10">
          <div className="space-y-8">
            <span className="font-mono text-[10px] tracking-[0.6em] text-white/20 uppercase">
              Ready to Secure your legacy?
            </span>
            <h2 className="font-cormorant text-7xl md:text-[10rem] text-white leading-[0.8] tracking-tighter">
              Establish your <br />
              <span className="italic">strategic baseline.</span>
            </h2>
          </div>

          <div className="flex flex-col items-center gap-16">
            <Link href="/signup">
              <HoverButton
                glowColor="rgba(255,255,255,0.4)"
                className="px-24 py-10 rounded-full"
              >
                Establish Your Architecture
              </HoverButton>
            </Link>

            <div className="flex flex-col items-center gap-8">
              <div className="h-40 w-[1px] bg-gradient-to-b from-white/20 to-transparent" />
              <p className="font-mono text-[9px] tracking-[0.6em] text-white/20 uppercase">
                Axiom Strategic Protocol // v1.0
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LUXURY FOOTER */}
      <footer className="py-32 px-8 md:px-24 border-t border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-[1.5fr_1fr_1fr] gap-24 items-start">
          <div className="space-y-12">
            <div className="flex items-center gap-4">
              <BrandMark className="w-8 h-8" />
              <span className="font-mono text-xs tracking-[0.5em] uppercase font-bold">
                AXIOM
              </span>
            </div>
            <p className="text-white/20 text-lg font-light leading-relaxed max-w-sm">
              Deterministic financial intelligence for the sovereign individual.
              Precision modeling for a chaotic ecosystem.
            </p>
            <div className="pt-8 border-t border-white/5 flex gap-8 font-mono text-[9px] tracking-widest text-white/10 uppercase">
              <span>Encrypted Session</span>
              <span>Regional Node: Nairobi</span>
            </div>
          </div>

          <div className="space-y-10">
            <h4 className="font-cormorant italic text-2xl text-white/60">
              Intelligence
            </h4>
            <div className="flex flex-col gap-6 font-mono text-[10px] tracking-[0.4em] uppercase text-white/30">
              <Link href="#" className="hover:text-white transition-colors">
                Methodology
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Taxonomy
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Risk Protocol
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Legacy Design
              </Link>
            </div>
          </div>

          <div className="space-y-10">
            <h4 className="font-cormorant italic text-2xl text-white/60">
              Legal
            </h4>
            <div className="flex flex-col gap-6 font-mono text-[10px] tracking-[0.4em] uppercase text-white/30">
              <Link href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Compliance Audit
              </Link>
              <div className="pt-12 text-white/10 italic normal-case font-serif text-sm">
                © 2026 Axiom Labs. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
