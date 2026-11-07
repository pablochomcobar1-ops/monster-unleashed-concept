"use client";

import Link from "next/link";
import { useRef } from "react";
import { worlds } from "@/content/worlds";

const pad = (n: number) => String(n).padStart(2, "0");

/** Horizontal strip of the 6 worlds. Swipe on phones, arrows or shift+wheel on desktop. */
export function WorldsStrip() {
  const trackRef = useRef<HTMLUListElement>(null);

  const scrollByCard = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 16 : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section aria-labelledby="worlds-title" className="py-section">
      <div className="mx-auto flex max-w-[1440px] items-end justify-between gap-6 px-6 md:px-14">
        <div className="flex flex-col gap-3">
          <p className="text-caption01 uppercase tracking-[0.35em] text-foreground-subtle">Used by</p>
          <h2 id="worlds-title" className="font-display text-heading01 font-bold uppercase md:text-hero02">
            Where the <span className="text-brand">beast</span> runs
          </h2>
        </div>
        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous worlds"
            className="inline-flex size-12 items-center justify-center rounded-pill border border-foreground-subtle text-foreground transition-colors hover:border-brand hover:text-brand"
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Next worlds"
            className="inline-flex size-12 items-center justify-center rounded-pill border border-foreground-subtle text-foreground transition-colors hover:border-brand hover:text-brand"
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <ul
        ref={trackRef}
        className="mt-10 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto scroll-smooth px-6 pb-4 md:scroll-px-14 [scrollbar-width:none] md:px-14 motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden"
      >
        {worlds.map((w, i) => (
          <li key={w.id} className="w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[30vw] xl:w-[24vw]">
            <Link
              href={`/used-by#${w.id}`}
              className="group relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-[6px] border border-border-subtle bg-background-secondary p-6 transition-colors hover:border-brand"
            >
              {/* Poster image arrives with the stock videos in Task 10 */}
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(166_255_0/0.14),transparent_60%)] transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <span className="relative font-display text-caption01 uppercase tracking-[0.3em] text-foreground-subtle">
                {pad(i + 1)} / {pad(worlds.length)}
              </span>
              <span className="relative flex flex-col gap-3">
                <span className="font-display text-heading01 font-bold uppercase transition-colors group-hover:text-brand">
                  {w.title}
                </span>
                <span className="text-body02 text-foreground-secondary">{w.line}</span>
                <span className="font-display text-caption01 uppercase tracking-[0.25em] text-brand">{w.stat}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
