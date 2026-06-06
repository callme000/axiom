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
    <section className="relative min-h-screen flex flex-col justify-center items-center px-6 text-center overflow-hidden bg-black selection:bg-white selection:text-black">
      {/* Dynamic Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isVisible ? { opacity: 1, scale: 1.1 } : {}}
          transition={{ duration: 4, ease: "easeOut" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-white/[0.03] rounded-full blur-[180px]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isVisible ? { opacity: 1, scale: 1.1 } : {}}
          transition={{ duration: 4, ease: "easeOut", delay: 0.7 }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-white/[0.03] rounded-full blur-[180px]"
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto pt-20">
        {/* Editorial Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="inline-flex items-center gap-6 mb-12"
        >
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <span className="font-mono text-[9px] tracking-[0.8em] text-white/30 uppercase">
            Axiom Strategic Wealth Architecture
          </span>
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </motion.div>

        {/* Main Display Headline */}
        <h1 className="font-cormorant italic text-7xl md:text-[10rem] lg:text-[12rem] text-white leading-[0.8] tracking-tighter mb-12 overflow-hidden">
          <motion.span
            initial={{ y: "100%" }}
            animate={isVisible ? { y: 0 } : {}}
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
            animate={isVisible ? { y: 0 } : {}}
            transition={{
              duration: 1.2,
              delay: 0.7,
              ease: [0.215, 0.61, 0.355, 1],
            }}
            className="block not-italic font-medium text-white/90"
          >
            For Your Future.
          </motion.span>
        </h1>

        {/* Narrative Body */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="max-w-2xl mx-auto text-white/40 text-xl md:text-2xl font-light leading-relaxed mb-16"
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
          className="flex justify-center"
        >
          <Link href="/signup">
            <HoverButton
              glowColor="rgba(255,255,255,0.5)"
              className="px-24 py-8 rounded-full border border-white/20"
            >
              Initialize Access
            </HoverButton>
          </Link>
        </motion.div>
      </div>

      {/* Luxury Scroll Anchor */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6"
      >
        <div className="w-[1px] h-24 bg-gradient-to-b from-white/40 via-white/10 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}
