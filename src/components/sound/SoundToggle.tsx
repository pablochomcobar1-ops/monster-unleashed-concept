"use client";

import { cn } from "@/lib/cn";
import { useSound } from "./SoundProvider";

export function SoundToggle({ className }: { className?: string }) {
  const { enabled, toggle } = useSound();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      className={cn(
        "inline-flex min-h-11 items-center gap-2.5 rounded-pill border px-4",
        "font-display text-caption01 uppercase tracking-[0.2em]",
        "transition-colors duration-200",
        enabled
          ? "border-brand text-brand"
          : "border-foreground-subtle text-foreground hover:border-foreground",
        className,
      )}
    >
      <span aria-hidden="true" className="flex h-3 items-end gap-[3px]">
        {[0, 1, 2].map((bar) => (
          <span
            key={bar}
            className={cn(
              "w-[3px] origin-bottom rounded-sm bg-current",
              enabled ? "animate-[sound-bar_0.9s_ease-in-out_infinite] motion-reduce:animate-none" : "",
            )}
            style={{ height: enabled ? "100%" : "35%", animationDelay: `${bar * 0.15}s` }}
          />
        ))}
      </span>
      Sound
      <span aria-hidden="true" className="tabular-nums">
        {enabled ? "On" : "Off"}
      </span>
    </button>
  );
}
