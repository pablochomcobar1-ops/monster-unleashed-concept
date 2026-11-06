"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** A heading that flickers in like a bad signal the first time it scrolls into view. */
export function GlitchTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.h2
      className={className}
      initial={reduceMotion ? false : { opacity: 0 }}
      whileInView={
        reduceMotion
          ? undefined
          : { opacity: [0, 1, 0.2, 1, 0.5, 1], x: [0, -8, 6, -3, 2, 0], skewX: [0, 8, -6, 3, 0, 0] }
      }
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: "linear" }}
    >
      {children}
    </motion.h2>
  );
}
