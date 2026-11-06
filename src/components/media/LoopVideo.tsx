"use client";

import { useEffect, useRef, useState } from "react";
import type { WorldVideo } from "@/content/worlds";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";

type NetworkInfo = { saveData?: boolean };

/** True when the visitor has Data Saver / Lite mode on. */
function prefersSavingData(): boolean {
  if (typeof navigator === "undefined") return false;
  return Boolean((navigator as Navigator & { connection?: NetworkInfo }).connection?.saveData);
}

/**
 * Muted looping background video. Loads nothing until it's on screen, plays only
 * while at least 25% visible, pauses off-screen. Data Saver or reduced motion:
 * just the poster image. Autoplay blocked: the poster stays, nothing breaks.
 */
export function LoopVideo({ src, label, className }: { src: WorldVideo; label: string; className?: string }) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stillOnly, setStillOnly] = useState(false);

  useEffect(() => {
    // Read after mount: the server can't know the visitor's data setting.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStillOnly(prefersSavingData());
  }, []);

  const showPoster = reduceMotion || stillOnly;

  useEffect(() => {
    const video = videoRef.current;
    if (showPoster || !video || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const attempt = video.play();
          if (attempt && typeof attempt.catch === "function") attempt.catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(video);
    return () => {
      io.disconnect();
      video.pause();
    };
  }, [showPoster]);

  if (showPoster) {
    // eslint-disable-next-line @next/next/no-img-element -- static poster from /public, sized by CSS
    return <img src={src.poster} alt={label} className={cn("h-full w-full object-cover", className)} />;
  }

  return (
    <video
      ref={videoRef}
      className={cn("h-full w-full object-cover", className)}
      poster={src.poster}
      aria-label={label}
      muted
      loop
      playsInline
      preload="none"
    >
      <source src={src.webm} type="video/webm" />
      <source src={src.mp4} type="video/mp4" />
    </video>
  );
}
