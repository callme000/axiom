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
import { Zap } from "lucide-react";

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
    <main className="bg-background text-foreground min-h-screen selection:bg-primary selection:text-primary-foreground overflow-x-hidden antialiased">
      {/* Dynamic Background Atmosphere - Functional Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-glow-truth animate-pulse-glow" />
        <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-glow-opportunity animate-pulse-glow [animation-delay:1s]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-glow-warning animate-pulse-glow [animation-delay:2s]" />
      </div>

      {/* Editorial Navigation - Dynamic Glassmorphism */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 px-4 md:px-8 flex justify-between items-center transition-all duration-700 ${
          isScrolled
            ? "py-4 md:py-5 glass-panel border-b border-border shadow-2xl"
            : "py-6 md:py-10 bg-transparent border-b border-transparent"
        }`}
      >
        <div className="flex items-center gap-3 md:gap-4 group cursor-pointer">
          <BrandMark className="w-8 h-8 md:w-10 md:h-10" />
          <div className="flex flex-col">
            <span className="font-mono text-[10px] tracking-[0.6em] uppercase font-bold text-foreground">
              AXIOM
            </span>
            <span className="text-[7px] font-mono tracking-[0.3em] uppercase text-muted-foreground/60">
              Sovereign Intel
            </span>
          </div>
        </div>
        <div className="flex gap-4 md:gap-8 items-center">
          <Link href="/signup" className="hidden sm:block">
            <RippleButton
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              Access Portal
            </RippleButton>
          </Link>
          <Link href="/signup">
            <RippleButton
              variant="hoverborder"
              hoverBorderEffectColor="var(--truth)"
              className="text-[10px] flex items-center gap-2"
            >
              <Zap size={12} strokeWidth={1.5} className="text-truth" />
              Initialize
            </RippleButton>
          </Link>
        </div>
      </nav>

      {/* ASSEMBLY */}
      <div className="relative z-10">
        <LuxuryHero />
        <SolvencyCalculator />
        <StrategicPillars />
        <ProcessFlow />

        {/* FINAL CONVERSION SECTION */}
        <section className="py-40 md:py-80 px-6 text-center bg-linear-to-b from-background to-card relative">
          <div className="max-w-5xl mx-auto space-y-16 md:space-y-24 relative z-10">
            <div className="space-y-6 md:space-y-8">
              <span className="font-mono text-[10px] tracking-[0.8em] text-truth uppercase animate-pulse">
                Ready to Secure your legacy?
              </span>
              <h2 className="font-cormorant text-5xl md:text-7xl lg:text-[10rem] text-foreground leading-[0.8] tracking-tighter">
                Establish your <br />
                <span className="italic">strategic baseline.</span>
              </h2>
            </div>

            <div className="flex flex-col items-center gap-12 md:gap-16">
              <Link href="/signup">
                <HoverButton
                  glowColor="var(--truth)"
                  className="px-12 md:px-24 py-6 md:py-10 rounded-full text-xs md:text-sm border-border hover:border-truth/50 transition-colors"
                >
                  Establish Your Architecture
                </HoverButton>
              </Link>

              <div className="flex flex-col items-center gap-6 md:gap-8">
                <div className="h-24 md:h-40 w-px bg-linear-to-b from-truth/40 to-transparent" />
                <p className="font-mono text-[9px] tracking-[0.6em] text-muted-foreground/40 uppercase">
                  Axiom Strategic Protocol // v1.0
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LUXURY FOOTER */}
        <footer className="py-20 md:py-32 px-6 md:px-24 border-t border-border bg-card/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-16 md:gap-24 items-start">
            <div className="space-y-12">
              <div className="flex items-center gap-4">
                <BrandMark className="w-8 h-8" />
                <span className="font-mono text-xs tracking-[0.5em] uppercase font-bold text-foreground">
                  AXIOM
                </span>
              </div>
              <p className="text-muted-foreground text-lg font-light leading-relaxed max-w-sm">
                Deterministic financial intelligence for the sovereign individual.
                Precision modeling for a chaotic ecosystem.
              </p>
              <div className="pt-8 border-t border-border flex gap-8 font-mono text-[9px] tracking-widest text-muted-foreground/30 uppercase">
                <span>Encrypted Session</span>
                <span>Regional Node: Nairobi</span>
              </div>
            </div>

            <div className="space-y-10">
              <h4 className="font-cormorant italic text-2xl text-foreground/80">
                Intelligence
              </h4>
              <div className="flex flex-col gap-6 font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground/50">
                <Link href="#" className="hover:text-truth transition-colors">
                  Methodology
                </Link>
                <Link href="#" className="hover:text-truth transition-colors">
                  Taxonomy
                </Link>
                <Link href="#" className="hover:text-truth transition-colors">
                  Risk Protocol
                </Link>
                <Link href="#" className="hover:text-truth transition-colors">
                  Legacy Design
                </Link>
              </div>
            </div>

            <div className="space-y-10">
              <h4 className="font-cormorant italic text-2xl text-foreground/80">
                Legal
              </h4>
              <div className="flex flex-col gap-6 font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground/50">
                <Link href="#" className="hover:text-truth transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="hover:text-truth transition-colors">
                  Terms of Service
                </Link>
                <Link href="#" className="hover:text-truth transition-colors">
                  Compliance Audit
                </Link>
                <div className="pt-12 text-muted-foreground/20 italic normal-case font-serif text-sm">
                  © 2026 Axiom Labs. All rights reserved.
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
