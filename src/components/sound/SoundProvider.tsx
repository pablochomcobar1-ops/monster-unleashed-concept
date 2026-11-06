"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

export type SoundName = "crack" | "whoosh";

const SOURCES = {
  crack: "/sfx/crack.mp3",
  whoosh: "/sfx/whoosh.mp3",
  rumble: "/sfx/rumble.mp3",
} as const;

type SoundContextValue = {
  enabled: boolean;
  toggle: () => void;
  play: (name: SoundName) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

/** Plays a clip and swallows failures (missing file, autoplay blocked). */
function safePlay(audio: HTMLAudioElement) {
  try {
    const result = audio.play();
    if (result && typeof result.catch === "function") result.catch(() => {});
  } catch {
    // Some browsers throw synchronously when media is unsupported.
  }
}

/**
 * Sound is OFF on every visit and only starts after the visitor turns it on,
 * so nothing ever autoplays.
 */
export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const rumbleRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!enabled) {
      rumbleRef.current?.pause();
      return;
    }
    if (!rumbleRef.current) {
      const rumble = new Audio(SOURCES.rumble);
      rumble.loop = true;
      rumble.volume = 0.25;
      rumbleRef.current = rumble;
    }
    safePlay(rumbleRef.current);
  }, [enabled]);

  useEffect(() => () => rumbleRef.current?.pause(), []);

  const toggle = useCallback(() => setEnabled((on) => !on), []);

  const play = useCallback(
    (name: SoundName) => {
      if (!enabled) return;
      const clip = new Audio(SOURCES[name]);
      clip.volume = 0.6;
      safePlay(clip);
    },
    [enabled],
  );

  const value = useMemo(() => ({ enabled, toggle, play }), [enabled, toggle, play]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used inside <SoundProvider>");
  return ctx;
}
