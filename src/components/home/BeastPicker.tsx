"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getFlavor, type FlavorId } from "@/content/flavors";
import { pickFlavor, pickerQuestions, type PickerAnswers } from "@/content/picker";
import { site } from "@/content/site";
import { setFlood } from "@/components/background/Atmosphere";
import { CanStage } from "@/components/can/CanStage";
import { useSound } from "@/components/sound/SoundProvider";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** "Pick your beast": 3 quick questions → the flavour that fits you. */
export function BeastPicker() {
  const reduceMotion = useReducedMotion();
  const { play } = useSound();
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<FlavorId | null>(null);
  const moved = useRef(false);

  const step = answers.length;

  // Each new question / result heading takes keyboard + screen-reader focus as it appears
  // (after the previous one has slid out). Not on first page load.
  const focusOnMount = useCallback((el: HTMLHeadingElement | null) => {
    if (el && moved.current) el.focus();
  }, []);

  const answer = (choice: number) => {
    moved.current = true;
    const next = [...answers, choice];
    if (next.length === pickerQuestions.length) {
      const id = pickFlavor(next as PickerAnswers);
      setResult(id);
      setFlood(getFlavor(id).color);
      play("crack");
    }
    setAnswers(next);
  };

  const restart = () => {
    moved.current = true;
    setAnswers([]);
    setResult(null);
  };

  const slide = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 } }
    : {
        initial: { opacity: 0, x: 60 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -60 },
        transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
      };

  const flavor = result ? getFlavor(result) : null;

  return (
    <section id="picker" aria-labelledby="picker-title" className="scroll-mt-20 py-section">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-6 md:grid-cols-2 md:px-14">
        <div className="flex min-h-[460px] flex-col justify-center gap-8">
          <div className="flex flex-col gap-3">
            <p className="text-caption01 uppercase tracking-[0.35em] text-foreground-subtle">3 questions. No wrong answers.</p>
            <h2 id="picker-title" className="font-display text-hero02 font-bold uppercase">
              Pick your <span className="text-brand">beast</span>
            </h2>
          </div>

          <div aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {!flavor ? (
                <motion.div key={`q${step}`} {...slide} className="flex flex-col gap-6">
                  <p className="font-display text-caption01 uppercase tracking-[0.3em] text-foreground-secondary">
                    Question {step + 1} of {pickerQuestions.length}
                  </p>
                  <h3 ref={focusOnMount} tabIndex={-1} className="font-display text-heading02 font-bold uppercase outline-none">
                    {pickerQuestions[step].question}
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {pickerQuestions[step].options.map((opt, i) => (
                      <li key={opt.label}>
                        <button
                          type="button"
                          onClick={() => answer(i)}
                          className="group flex min-h-14 w-full items-center justify-between rounded-[6px] border border-foreground-subtle px-5 text-left font-display text-body01 uppercase tracking-[0.08em] transition-colors hover:border-brand hover:bg-brand hover:text-background"
                        >
                          {opt.label}
                          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ) : (
                <motion.div key="result" {...slide} className="flex flex-col gap-6">
                  <h3 ref={focusOnMount} tabIndex={-1} className="font-display text-heading01 font-bold uppercase outline-none">
                    Your beast: <span style={{ color: flavor.color }}>{flavor.name}</span>
                  </h3>
                  <p className="font-display text-heading03 uppercase" style={{ color: flavor.color }}>
                    {flavor.tagline}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={restart}
                      className="inline-flex min-h-12 items-center rounded-pill border border-foreground-subtle px-6 font-display text-body02 uppercase tracking-[0.15em] transition-colors hover:border-foreground"
                    >
                      Again
                    </button>
                    <a
                      href={site.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-12 items-center rounded-pill bg-brand px-6 font-display text-body02 font-semibold uppercase tracking-[0.15em] text-background transition-colors hover:bg-brand-accent"
                    >
                      Grab a can (official site)
                      <span className="sr-only">, opens in a new tab</span>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!flavor && (
            <div className="flex gap-2" aria-hidden="true">
              {pickerQuestions.map((q, i) => (
                <span key={q.id} className={`h-1 flex-1 rounded-full ${i < step ? "bg-brand" : "bg-border"}`} />
              ))}
            </div>
          )}
        </div>

        <div className="h-[56vh] min-h-[380px]">
          {flavor ? (
            <CanStage key={flavor.id} flavorId={flavor.id} onCanClick={() => play("crack")} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span aria-hidden="true" className="font-display text-[clamp(8rem,22vw,18rem)] font-bold leading-none text-transparent [-webkit-text-stroke:2px_var(--color-border)]">
                ?
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
