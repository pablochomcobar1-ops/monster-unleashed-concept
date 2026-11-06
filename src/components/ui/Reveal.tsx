"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** Fades and lifts its children into place when they scroll into view. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** Use "span" inside headings (a div isn't allowed there). */
  as?: "div" | "span";
}) {
  const reduceMotion = useReducedMotion();
  const Tag = as === "span" ? motion.span : motion.div;
  return (
    <Tag
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  );
}
