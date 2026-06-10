"use client";

import { motion } from "framer-motion";

export function BrandMark({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={`${className} relative flex items-center justify-center cursor-pointer`}
    >
      {/* Main Glass Background */}
      <motion.div
        variants={{
          initial: { rotate: 0, scale: 1 },
          hover: {
            rotate: 4,
            scale: 1.08,
            boxShadow: "0 15px 30px rgba(59, 130, 246, 0.2)",
          },
          tap: { scale: 0.95 },
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
        className="absolute inset-0 glass-panel rounded-[32%] shadow-lg border border-truth/20"
      />

      {/* Pop-out Frame - Functional Glow */}
      <motion.div
        variants={{
          initial: { rotate: 0, scale: 1, opacity: 0 },
          hover: {
            rotate: 10,
            scale: 1.25,
            opacity: 0.4,
          },
        }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 20,
        }}
        className="absolute inset-0 border border-truth rounded-[32%] pointer-events-none blur-[2px]"
      />

      {/* Static Text - San Francisco (SF Pro) */}
      <span
        className="relative z-10 text-truth font-black text-xl select-none pointer-events-none drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        }}
      >
        A
      </span>
    </motion.div>
  );
}
