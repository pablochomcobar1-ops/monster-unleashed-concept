"use client";

import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";

/**
 * Sets the colour of the background glow. FlavorStory calls this as you scroll
 * through the flavours; the glow fades to the new colour (CSS transition).
 */
export function setFlood(color: string) {
  document.documentElement.style.setProperty("--flood", color);
}

/**
 * Fixed full-screen layer behind every page:
 * 1. flavour glow (--flood), 2. two drifting green fog clouds, 3. film grain.
 * GPU-light: only transform/opacity animate, no canvas, no WebGL.
 */
export function Atmosphere() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      data-motion={reduceMotion ? "off" : "on"}
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Flavour glow */}
      <div className="atmo-flood absolute inset-0" />

      {/* Fog clouds */}
      <div
        className={cn(
          "atmo-fog absolute -bottom-[30%] -left-[20%] h-[90vmax] w-[90vmax] opacity-60",
          !reduceMotion && "atmo-drift-a",
        )}
      />
      <div
        className={cn(
          "atmo-fog absolute -right-[25%] -top-[35%] h-[80vmax] w-[80vmax] opacity-35",
          !reduceMotion && "atmo-drift-b",
        )}
      />

      {/* Film grain */}
      <div className={cn("atmo-grain absolute -inset-[50%]", !reduceMotion && "atmo-grain-shift")} />

      {/* Vignette keeps edges dark so text stays readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(5_6_5/0.85)_100%)]" />
    </div>
  );
}
