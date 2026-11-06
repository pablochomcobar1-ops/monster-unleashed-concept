import type Lenis from "lenis";

/** The running smooth-scroll instance (set by <SmoothScroll />), or null with reduced motion. */
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

const HEADER_OFFSET = -80;

/**
 * Scrolls to an in-page section (e.g. "#picker") and updates the address bar.
 * Uses smooth scroll when it's running, a native jump otherwise.
 */
export function scrollToHash(hash: string): boolean {
  const el = document.getElementById(hash.replace(/^#/, ""));
  if (!el) return false;
  if (lenis) {
    lenis.scrollTo(el, { offset: HEADER_OFFSET });
  } else {
    el.scrollIntoView({ block: "start" });
  }
  history.pushState(null, "", hash);
  return true;
}
