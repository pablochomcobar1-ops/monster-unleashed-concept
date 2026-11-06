import type { Flavor } from "@/content/flavors";
import { cn } from "@/lib/cn";

/**
 * Flat CSS can: shown on the server, while 3D loads, and on devices without WebGL.
 * Uses the flavour colour, so it never shows a broken image before the real photos exist.
 */
export function CanFallback({ flavor, className }: { flavor: Flavor; className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        role="img"
        aria-label={`${flavor.name} can`}
        className="relative aspect-[1/2.55] h-[min(62vh,520px)] overflow-hidden rounded-[18%/7%] shadow-[0_40px_80px_rgb(0_0_0/0.6)]"
        style={{
          background: `linear-gradient(90deg, #0b0d0a 0%, #232821 22%, #3a4136 38%, #151814 62%, #050605 100%)`,
        }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-y-[14%] left-1/2 w-[34%] -translate-x-1/2 opacity-90"
          style={{ background: flavor.color, filter: "blur(0.5px)" }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center font-display font-bold uppercase text-background"
          style={{ writingMode: "vertical-rl", fontSize: "clamp(1rem, 3.2vh, 1.75rem)", letterSpacing: "0.15em" }}
        >
          {flavor.name}
        </span>
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[6%] bg-gradient-to-b from-[#c9d1c2] to-[#5d6459]" />
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[4%] bg-gradient-to-t from-[#8a9483] to-[#3a4136]" />
      </div>
    </div>
  );
}
