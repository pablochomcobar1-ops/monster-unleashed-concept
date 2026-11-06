"use client";

// TEMPORARY test bench for the 3D can. Deleted in Task 6 when the real hero lands.
import { useState } from "react";
import { flavors, type FlavorId } from "@/content/flavors";
import { setFlood } from "@/components/background/Atmosphere";
import { useSound } from "@/components/sound/SoundProvider";
import { cn } from "@/lib/cn";
import { CanStage } from "./CanStage";

export function CanPreview() {
  const [id, setId] = useState<FlavorId>("original");
  const [spin, setSpin] = useState(0);
  const { play } = useSound();

  return (
    <section className="grid min-h-dvh items-center gap-8 px-6 pt-24 md:grid-cols-[1fr_1.1fr] md:px-14">
      <div className="flex flex-col gap-6">
        <p className="text-caption01 uppercase tracking-[0.3em] text-foreground-subtle">Concept build · Task 5 test bench</p>
        <h1 className="font-display text-hero02 font-bold uppercase">
          Fear is <span className="text-brand">optional.</span>
        </h1>
        <div className="flex flex-wrap gap-3" role="group" aria-label="Pick a flavour">
          {flavors.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={id === f.id}
              onClick={() => {
                setId(f.id);
                setFlood(f.color);
              }}
              className={cn(
                "min-h-11 rounded-pill border px-4 font-display text-caption01 uppercase tracking-[0.15em]",
                id === f.id ? "border-transparent text-background" : "border-foreground-subtle text-foreground",
              )}
              style={id === f.id ? { background: f.color } : undefined}
            >
              {f.name}
            </button>
          ))}
        </div>
        <label className="flex max-w-sm flex-col gap-2 text-caption01 uppercase tracking-[0.2em] text-foreground-secondary">
          Spin (scroll stand-in)
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={spin}
            onChange={(e) => setSpin(Number(e.target.value))}
            className="accent-brand"
          />
        </label>
      </div>
      <div className="h-[70vh] min-h-[420px]">
        <CanStage flavorId={id} progress={spin} onCanClick={() => play("crack")} />
      </div>
    </section>
  );
}
