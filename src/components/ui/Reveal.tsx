"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** Fades and lifts its children into place when they scroll into view. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  immediate = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** Use "span" inside headings (a div isn't allowed there). */
  as?: "div" | "span";
  /**
   * For content visible on first load (page heroes): a CSS entrance that starts at first paint
   * instead of waiting for JavaScript. Keeps Largest Contentful Paint fast.
   */
  immediate?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  if (immediate) {
    const Plain = as;
    return (
      <Plain className={["enter-up", className].filter(Boolean).join(" ")} style={{ "--d": `${delay}s` } as React.CSSProperties}>
        {children}
      </Plain>
    );
  }
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
