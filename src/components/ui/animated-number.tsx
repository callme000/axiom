"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  precision?: number;
  compact?: boolean;
}

export function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  className = "",
  precision = 0,
  compact = false,
}: AnimatedNumberProps) {
  const spring = useSpring(0, {
    mass: 1,
    stiffness: 50,
    damping: 15,
  });

  const display = useTransform(spring, (current) => {
    if (compact && current >= 10000) {
      return `${prefix}${new Intl.NumberFormat("en-KE", {
        notation: "compact",
        compactDisplay: "short",
        maximumFractionDigits: 1,
      }).format(current)}${suffix}`;
    }

    return `${prefix}${current.toLocaleString(undefined, {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    })}${suffix}`;
  });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span className={className}>{display}</motion.span>;
}
