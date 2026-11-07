"use client";

import Link from "next/link";
import { useRef } from "react";
import type { World } from "@/content/worlds";
import { useReducedMotion } from "@/lib/useReducedMotion";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * One world card: poster image always, and on desktop the clip plays while hovered or focused.
 * The video loads nothing until the first hover (preload="none").
 */
export function WorldCard({ world, index, total }: { world: World; index: number; total: number }) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canPlay = Boolean(world.video) && !reduceMotion;

  const start = () => {
    const v = videoRef.current;
    if (!v) return;
    const attempt = v.play();
    if (attempt && typeof attempt.catch === "function") attempt.catch(() => {});
  };
  const stop = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <Link
      href={`/used-by#${world.id}`}
      onMouseEnter={canPlay ? start : undefined}
      onMouseLeave={canPlay ? stop : undefined}
      onFocus={canPlay ? start : undefined}
      onBlur={canPlay ? stop : undefined}
      className="group relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-[6px] border border-border-subtle bg-background-secondary p-6 transition-colors hover:border-brand focus-visible:border-brand"
    >
      {world.video ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- small static poster from /public */}
          <img
            src={world.video.poster}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-70 transition-[opacity,transform] duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
          />
          {canPlay && (
            <video
              ref={videoRef}
              aria-hidden="true"
              tabIndex={-1}
              muted
              loop
              playsInline
              preload="none"
              className="absolute inset-0 hidden h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 md:block"
            >
              <source src={world.video.webm} type="video/webm" />
              <source src={world.video.mp4} type="video/mp4" />
            </video>
          )}
        </>
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(166_255_0/0.14),transparent_60%)] transition-transform duration-700 ease-out group-hover:scale-110"
        />
      )}

      {/* Keeps the text readable over any footage */}
      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/10" />

      <span className="relative font-display text-caption01 uppercase tracking-[0.3em] text-foreground-secondary">
        {pad(index + 1)} / {pad(total)}
      </span>
      <span className="relative flex flex-col gap-3">
        <span className="font-display text-heading01 font-bold uppercase transition-colors group-hover:text-brand">
          {world.title}
        </span>
        <span className="text-body02 text-foreground-secondary">{world.line}</span>
        <span className="font-display text-caption01 uppercase tracking-[0.25em] text-brand">{world.stat}</span>
      </span>
    </Link>
  );
}
