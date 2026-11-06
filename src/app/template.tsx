"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";

// The very first page load skips the wipe, so content appears instantly.
// Tracked in the browser only: on the server this module is shared by every visitor.
let hasNavigated = false;

/** Runs on every page change: a green panel wipes up off the screen to reveal the new page. */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  const [isFirstLoad] = useState(() => {
    if (typeof window === "undefined") return true;
    const first = !hasNavigated;
    hasNavigated = true;
    return first;
  });

  if (isFirstLoad) return <>{children}</>;

  if (reduceMotion) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
        {children}
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[60] origin-top bg-brand"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      />
      {children}
    </>
  );
}
