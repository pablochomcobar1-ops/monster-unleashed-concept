"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getFlavor, type FlavorId } from "@/content/flavors";
import { canUseWebGL, isLowPowerDevice } from "@/lib/canUseWebGL";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";
import { CanFallback } from "./CanFallback";

const CanScene = dynamic(() => import("./CanScene"), { ssr: false });

export type CanStageProps = {
  flavorId: FlavorId;
  progress?: number;
  velocity?: number;
  onCanClick?: () => void;
  className?: string;
};

/**
 * Picks the right can for the device:
 * flat CSS can on the server / no WebGL / very weak devices, otherwise the 3D can
 * (loaded lazily, with the flat can showing while it loads).
 */
export function CanStage({ flavorId, progress, velocity, onCanClick, className }: CanStageProps) {
  const flavor = getFlavor(flavorId);
  const reduceMotion = useReducedMotion();
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    // Decided after mount: the server can't know the visitor's device.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUse3D(canUseWebGL() && !isLowPowerDevice());
  }, []);

  if (!use3D) return <CanFallback flavor={flavor} className={cn("h-full w-full", className)} />;

  return (
    <div className={cn("relative h-full w-full", className)}>
      <CanScene
        flavor={flavor}
        progress={progress}
        velocity={velocity}
        reduceMotion={reduceMotion}
        onCanClick={onCanClick}
      />
    </div>
  );
}
