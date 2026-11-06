"use client";

import { Fragment } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";

const HEADLINE: { word: string; brand?: boolean }[] = [
  { word: "FEAR" },
  { word: "IS" },
  { word: "OPTIONAL.", brand: true },
];

/** First screen of the story: headline left, the shared can stage sits to the right. */
export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex min-h-dvh flex-col justify-end gap-6 pb-[9vh] pt-28 md:justify-center md:gap-7 md:pb-0">
      <motion.p
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-caption01 uppercase tracking-[0.35em] text-foreground-subtle"
      >
        Night ride · 02:47 AM
      </motion.p>

      <h1 className="font-display text-hero02 font-bold uppercase">
        {HEADLINE.map(({ word, brand }, i) => (
          <Fragment key={word}>
            <span className="inline-block overflow-hidden pb-1 align-bottom">
              <motion.span
                className={brand ? "inline-block text-brand" : "inline-block"}
                initial={reduceMotion ? false : { y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                {word}
              </motion.span>
            </span>
            {i < HEADLINE.length - 1 ? " " : null}
          </Fragment>
        ))}
      </h1>

      <motion.p
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.55 }}
        className="max-w-sm text-body01 text-foreground-secondary"
      >
        Crack the can. Kill the lights. Ride.
      </motion.p>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="flex flex-wrap gap-3"
      >
        <a
          href="#picker"
          className="inline-flex min-h-12 items-center rounded-pill bg-brand px-7 font-display text-body02 font-semibold uppercase tracking-[0.15em] text-background transition-colors hover:bg-brand-accent"
        >
          Pick your beast
        </a>
        <a
          href="#lineup"
          className="inline-flex min-h-12 items-center rounded-pill border border-foreground-subtle px-7 font-display text-body02 uppercase tracking-[0.15em] text-foreground transition-colors hover:border-foreground"
        >
          Meet the lineup
        </a>
      </motion.div>

      <p aria-hidden="true" className="mt-6 hidden text-caption02 uppercase tracking-[0.3em] text-foreground-subtle md:block">
        Scroll ↓
      </p>
    </div>
  );
}
