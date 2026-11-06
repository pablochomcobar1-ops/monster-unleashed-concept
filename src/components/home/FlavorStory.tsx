"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { flavors } from "@/content/flavors";
import { setFlood } from "@/components/background/Atmosphere";
import { CanFallback } from "@/components/can/CanFallback";
import { CanStage } from "@/components/can/CanStage";
import { useSound } from "@/components/sound/SoundProvider";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Hero } from "./Hero";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const pad = (n: number) => String(n).padStart(2, "0");

/** One flavour's text panel. */
function FlavorPanel({ index }: { index: number }) {
  const f = flavors[index];
  return (
    <section
      id={index === 0 ? "lineup" : undefined}
      aria-label={f.name}
      className="flex min-h-dvh flex-col justify-end gap-5 pb-[9vh] md:justify-center md:pb-0"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.5 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-5"
      >
        <p className="font-display text-caption01 uppercase tracking-[0.35em] text-foreground-secondary">
          <span style={{ color: f.color }}>{pad(index + 1)}</span> / {pad(flavors.length)}
          {f.sugarFree ? " · Zero sugar" : ""}
        </p>
        <h2 className="font-display text-hero02 font-bold uppercase">{f.name}</h2>
        <p className="max-w-sm font-display text-heading03 uppercase tracking-[0.05em]" style={{ color: f.color }}>
          {f.tagline}
        </p>
        <Link
          href="/ingredients"
          className="w-fit border-b border-foreground-subtle pb-1 text-caption01 uppercase tracking-[0.25em] text-foreground-secondary transition-colors hover:border-brand hover:text-brand"
        >
          See what&apos;s inside →
        </Link>
      </motion.div>
    </section>
  );
}

/** Reduced-motion version: plain stacked sections, a flat can in each, nothing pinned. */
function StaticStory() {
  return (
    <div className="mx-auto max-w-[1440px] px-6 md:px-14">
      <Hero />
      {flavors.map((f, i) => (
        <div key={f.id} className="grid items-center gap-6 md:grid-cols-2">
          <FlavorPanel index={i} />
          <CanFallback flavor={f} className="h-[70vh]" />
        </div>
      ))}
    </div>
  );
}

/**
 * The signature moment: the hero and the 5 flavours scroll past while the can stays
 * pinned (sticky). Scrolling spins it, swaps the label and floods the background colour.
 */
export function FlavorStory() {
  const reduceMotion = useReducedMotion();
  const { play } = useSound();
  const storyRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const settleTimer = useRef<number | undefined>(undefined);
  const firstChange = useRef(true);
  const insideStory = useRef(true);

  useGSAP(
    () => {
      if (reduceMotion || !storyRef.current) return;
      // Screens: 0 = hero, 1–5 = flavours. `screen` is how many screens we've scrolled.
      // Whole numbers = a screen is fully in view → the can faces front (1 turn per screen).
      // The label swaps at the half-way point, while the can's back is turned.
      ScrollTrigger.create({
        trigger: storyRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const screen = self.progress * flavors.length;
          const index = Math.min(flavors.length - 1, Math.max(0, Math.round(screen) - 1));
          setActive(index);
          setProgress(screen);
          setVelocity(Math.min(Math.abs(self.getVelocity()) / 2500, 1));
          window.clearTimeout(settleTimer.current);
          settleTimer.current = window.setTimeout(() => setVelocity(0), 150);
        },
        // Past the story: back to brand green. Scrolling back up: the last flavour again.
        onLeave: () => {
          insideStory.current = false;
          setFlood(flavors[0].color);
        },
        onEnterBack: () => {
          insideStory.current = true;
          setFlood(flavors[flavors.length - 1].color);
        },
      });
    },
    { dependencies: [reduceMotion] },
  );

  // Flavour changed: fade the background glow and whoosh (skip the very first render).
  useEffect(() => {
    // A fast jump past the story (e.g. the "Pick your beast" button) must not repaint the glow.
    if (!insideStory.current) return;
    setFlood(flavors[active].color);
    if (firstChange.current) {
      firstChange.current = false;
      return;
    }
    play("whoosh");
    // `play` changes when sound is toggled; only a flavour change should whoosh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => () => window.clearTimeout(settleTimer.current), []);

  if (reduceMotion) return <StaticStory />;

  return (
    <div data-pinned="true" className="mx-auto grid max-w-[1440px] grid-cols-1 px-6 md:grid-cols-2 md:gap-10 md:px-14">
      {/* Can stage: sticky. Behind the text on phones, right column on desktop. */}
      <div className="col-start-1 row-start-1 md:col-start-2">
        <div className="sticky top-0 h-dvh">
          <p
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[30%] -translate-y-1/2 select-none md:top-1/2 text-center font-display text-hero01 font-bold uppercase text-transparent opacity-50 [-webkit-text-stroke:2px_var(--flood)] md:-left-1/2"
          >
            Unleash
          </p>
          <div className="absolute inset-x-0 top-[9vh] h-[50vh] md:inset-y-[8vh] md:top-[8vh] md:h-auto">
            <CanStage
              flavorId={flavors[active].id}
              progress={progress}
              velocity={velocity}
              onCanClick={() => play("crack")}
            />
          </div>
          {/* Phones: dark fade at the bottom so the text over the can stays readable */}
          <div aria-hidden="true" className="absolute inset-x-[-1.5rem] bottom-0 h-[50%] bg-gradient-to-t from-background via-background/85 to-transparent md:hidden" />
        </div>
      </div>

      {/* Text: hero, then one panel per flavour */}
      <div ref={storyRef} className="relative z-10 col-start-1 row-start-1">
        <Hero />
        {flavors.map((f, i) => (
          <FlavorPanel key={f.id} index={i} />
        ))}
      </div>
    </div>
  );
}
