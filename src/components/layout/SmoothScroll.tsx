"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { setLenis } from "@/lib/smoothScroll";

/**
 * Smooth (inertia) scrolling, kept in sync with GSAP ScrollTrigger.
 * Off when the visitor prefers reduced motion: native scrolling is used instead.
 * In-page links are handled by <AnchorLink />, not by Lenis.
 */
export function SmoothScroll() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // Marks the page as interactive (used by the browser tests to avoid clicking too early).
    document.documentElement.dataset.ready = "true";
    if (reduceMotion) return;
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ duration: 1.1, autoRaf: false });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      setLenis(null);
      lenis.destroy();
    };
  }, [reduceMotion]);

  return null;
}
