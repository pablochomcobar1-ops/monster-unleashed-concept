import { Fragment } from "react";
import { AnchorLink } from "@/components/ui/AnchorLink";

const HEADLINE: { word: string; brand?: boolean }[] = [
  { word: "FEAR" },
  { word: "IS" },
  { word: "OPTIONAL.", brand: true },
];

/** Delay helper for the CSS entrance animations (globals.css: .enter-up, .word-up). */
const delay = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

/**
 * First screen of the story: headline left, the shared can stage sits to the right.
 * Entrances are pure CSS so the headline paints immediately (fast LCP), no JS wait.
 */
export function Hero() {
  return (
    <div className="flex min-h-dvh flex-col justify-end gap-6 pb-[9vh] pt-28 md:justify-center md:gap-7 md:pb-0">
      <p className="enter-up text-caption01 uppercase tracking-[0.35em] text-foreground-subtle">Night ride · 02:47 AM</p>

      <h1 className="font-display text-hero02 font-bold uppercase">
        {HEADLINE.map(({ word, brand }, i) => (
          <Fragment key={word}>
            <span className="inline-block overflow-hidden pb-1 align-bottom">
              <span className={brand ? "word-up text-brand" : "word-up"} style={delay(0.15 + i * 0.08)}>
                {word}
              </span>
            </span>
            {i < HEADLINE.length - 1 ? " " : null}
          </Fragment>
        ))}
      </h1>

      <p className="enter-up max-w-sm text-body01 text-foreground-secondary" style={delay(0.55)}>
        Crack the can. Kill the lights. Ride.
      </p>

      <div className="enter-up flex flex-wrap gap-3" style={delay(0.7)}>
        <AnchorLink
          href="#picker"
          className="inline-flex min-h-12 items-center rounded-pill bg-brand px-7 font-display text-body02 font-semibold uppercase tracking-[0.15em] text-background transition-colors hover:bg-brand-accent"
        >
          Pick your beast
        </AnchorLink>
        <AnchorLink
          href="#lineup"
          className="inline-flex min-h-12 items-center rounded-pill border border-foreground-subtle px-7 font-display text-body02 uppercase tracking-[0.15em] text-foreground transition-colors hover:border-foreground"
        >
          Meet the lineup
        </AnchorLink>
      </div>

      <p aria-hidden="true" className="mt-6 hidden text-caption02 uppercase tracking-[0.3em] text-foreground-subtle md:block">
        Scroll ↓
      </p>
    </div>
  );
}
