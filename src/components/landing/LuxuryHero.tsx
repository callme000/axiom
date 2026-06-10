"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HoverButton } from "@/components/ui/hover-glow-button";
import { RippleButton } from "@/components/ui/multi-type-ripple-buttons";

export function LuxuryHero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center px-6 text-center overflow-hidden bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Dynamic Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isVisible ? { opacity: 1, scale: 1.1 } : {}}
          transition={{ duration: 4, ease: "easeOut" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-glow-truth animate-pulse-glow"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isVisible ? { opacity: 1, scale: 1.1 } : {}}
          transition={{ duration: 4, ease: "easeOut", delay: 0.7 }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-glow-opportunity animate-pulse-glow"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto pt-20">
        {/* Editorial Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="inline-flex items-center gap-6 mb-12"
        >
          <div className="h-px w-16 bg-linear-to-r from-transparent via-truth/20 to-transparent" />
          <span className="font-mono text-[9px] tracking-[0.8em] text-truth uppercase">
            Axiom Strategic Wealth Architecture
          </span>
          <div className="h-px w-16 bg-linear-to-r from-transparent via-truth/40 to-transparent" />
        </motion.div>

        {/* Main Display Headline */}
        <AnimatePresence>
          {isVisible && (
            <h1 className="font-cormorant italic text-5xl md:text-[8rem] lg:text-[12rem] text-foreground leading-[0.8] tracking-tighter mb-12 overflow-hidden">
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{
                  duration: 1.2,
                  delay: 0.5,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
                className="block"
              >
                Financial Progress,
              </motion.span>
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{
                  duration: 1.2,
                  delay: 0.7,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
                className="block not-italic font-medium text-foreground/90"
              >
                For Your Future.
              </motion.span>
            </h1>
          )}
        </AnimatePresence>

        {/* Narrative Body */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="max-w-2xl mx-auto text-muted-foreground text-lg md:text-2xl font-light leading-relaxed mb-16 px-4"
        >
          Beyond passive tracking. Axiom deploys deterministic intelligence to
          secure your structural solvency and amplify liquidity in the Kenyan
          ecosystem.
        </motion.p>

        {/* Elegant Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.5 }}
          className="flex flex-col md:flex-row justify-center gap-6 md:gap-8 px-6"
        >
          <Link href="/signup">
            <HoverButton
              glowColor="var(--truth)"
              className="px-12 md:px-24 py-6 md:py-8 rounded-full border border-border text-sm md:text-base hover:border-truth/50 transition-colors"
            >
              Initialize Access
            </HoverButton>
          </Link>
          <RippleButton
            variant="hoverborder"
            hoverBorderEffectColor="var(--truth)"
            className="px-12 md:px-16 py-6 md:py-8 rounded-full text-[9px] md:text-[10px] tracking-widest text-muted-foreground hover:text-foreground"
            onClick={() => {
              const el = document.getElementById("architecture");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            View Architecture →
          </RippleButton>
        </motion.div>
      </div>

      {/* Luxury Scroll Anchor */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6"
      >
        <div className="w-px h-24 bg-linear-to-b from-truth/40 via-truth/10 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}
