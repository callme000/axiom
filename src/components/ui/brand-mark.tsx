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
      {/* Main Rounded Background - Subtle Tilt Right */}
      <motion.div
        variants={{
          initial: { rotate: 0, scale: 1 },
          hover: {
            rotate: 4,
            scale: 1.08,
            boxShadow: "0 15px 30px rgba(255, 255, 255, 0.1)",
          },
          tap: { scale: 0.95 },
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
        className="absolute inset-0 bg-white rounded-[32%] shadow-lg"
      />

      {/* Pop-out Frame - More rotation and scale for depth */}
      <motion.div
        variants={{
          initial: { rotate: 0, scale: 1, opacity: 0 },
          hover: {
            rotate: 10,
            scale: 1.25,
            opacity: 0.3,
          },
        }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 20,
        }}
        className="absolute inset-0 border border-white rounded-[32%] pointer-events-none"
      />

      {/* Static Text - San Francisco (SF Pro) */}
      <span
        className="relative z-10 text-black font-black text-xl select-none pointer-events-none"
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
