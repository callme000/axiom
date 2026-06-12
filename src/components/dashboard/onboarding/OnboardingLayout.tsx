"use client";

import { motion } from "framer-motion";
import { BrandMark } from "@/components/ui/brand-mark";
import type { LucideIcon } from "lucide-react";

export function OnboardingHeader({
  step,
  totalSteps,
}: {
  step: number;
  totalSteps: number;
}) {
  const romans = ["I", "II", "III", "IV"];
  return (
    <nav className="absolute top-0 left-0 w-full z-50 px-6 md:px-12 py-6 md:py-10 flex justify-between items-center mix-blend-difference pointer-events-none">
      <div className="flex items-center gap-4 md:gap-6 group cursor-pointer pointer-events-auto">
        <BrandMark className="w-8 h-8 md:w-10 md:h-10" />
        <div className="flex flex-col">
          <span className="font-mono text-[10px] tracking-[0.6em] uppercase font-bold text-foreground">
            AXIOM
          </span>
          <span className="text-[8px] font-mono tracking-[0.4em] uppercase text-muted-foreground/60">
            Architecture
          </span>
        </div>
      </div>
      <div className="flex gap-6 md:gap-12 items-center pointer-events-auto">
        <div className="flex gap-4 md:gap-8">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-2 text-foreground"
            >
              <span
                className={`font-mono text-[9px] tracking-widest transition-colors duration-700 ${
                  idx + 1 === step ? "opacity-100" : "opacity-30"
                }`}
              >
                {romans[idx]}
              </span>
              <motion.div
                animate={{ scaleX: idx + 1 === step ? 1 : 0 }}
                className="h-px w-3 md:w-4 bg-foreground origin-left"
              />
            </div>
          ))}
        </div>
        <span className="hidden md:block font-mono text-[9px] tracking-[0.4em] uppercase text-muted-foreground/50">
          v1.0
        </span>
      </div>
    </nav>
  );
}

export function OnboardingSidebar({
  roman,
  icon: Icon,
  iconColor,
  title,
  desc,
  direction,
}: {
  roman: string;
  icon: LucideIcon;
  iconColor: string;
  title: string;
  desc: string;
  direction: number;
}) {
  return (
    <div className="flex flex-col justify-center h-full md:border-r border-border md:pr-12 text-foreground overflow-hidden pt-4 md:pt-0">
      <motion.div
        key={title}
        initial={{ opacity: 0, x: direction * 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -direction * 50 }}
        transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
        className="space-y-4 md:space-y-6"
      >
        <div className="space-y-4 md:space-y-6">
          <div className="hidden md:flex items-center gap-6 font-mono font-bold text-8xl text-muted-foreground/10 leading-none select-none">
            {roman}
            <Icon strokeWidth={1.5} size={80} style={{ color: iconColor }} className="opacity-40 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
          </div>
          <h1 className="font-mono text-4xl md:text-5xl text-foreground leading-none tracking-[0.2em] uppercase font-bold">
            {title}
          </h1>
        </div>
        <p className="text-muted-foreground/80 text-base md:text-lg font-light leading-relaxed max-w-lg md:max-w-none">
          {desc}
        </p>
      </motion.div>
    </div>
  );
}
