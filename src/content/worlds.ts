export type WorldId = "motocross" | "skate" | "bmx" | "surf" | "esports" | "music";

export type WorldVideo = {
  mp4: string;
  webm: string;
  poster: string;
  /** Tall phone-shaped clip: full-screen on phones, a framed panel on desktop. */
  portrait?: boolean;
};

export type World = {
  id: WorldId;
  title: string;
  line: string;
  stat: string;
  /**
   * Free-licence stock clip (Pexels / Pixabay), or null until the files are in /public/video.
   * To add one: drop {id}.mp4, {id}.webm and {id}-poster.webp in public/video, then set `video: clip("{id}")`.
   */
  video: WorldVideo | null;
  /** Photographer / videographer credit, filled in when the clip is chosen. */
  credit: string;
};

const clip = (id: WorldId, portrait = false): WorldVideo => ({
  mp4: `/video/${id}.mp4`,
  webm: `/video/${id}.webm`,
  poster: `/video/${id}-poster.webp`,
  portrait,
});

export const worlds: readonly World[] = [
  {
    id: "motocross",
    title: "MOTOCROSS",
    line: "Dirt in the teeth. Throttle wide open.",
    stat: "AIRTIME > GROUND TIME",
    video: clip("motocross"),
    credit: "Pexels (video 12294780)",
  },
  {
    id: "skate",
    title: "SKATE",
    line: "Concrete doesn't forgive. Go anyway.",
    stat: "1 MORE TRY. ALWAYS.",
    video: clip("skate", true),
    credit: "Pexels (video 9723988)",
  },
  {
    id: "bmx",
    title: "BMX",
    line: "Two wheels. Zero plan. Full send.",
    stat: "HANDS OFF. EYES UP.",
    video: clip("bmx", true),
    credit: "Pexels (video 7935585)",
  },
  {
    id: "surf",
    title: "SURF",
    line: "The ocean picks the line. You hold on.",
    stat: "FIRST LIGHT. FIRST WAVE.",
    video: clip("surf"),
    credit: "Pexels (video 12855866)",
  },
  {
    id: "esports",
    title: "ESPORTS",
    line: "Last round. Last life. No lag.",
    stat: "CLUTCH OR NOTHING.",
    video: clip("esports"),
    credit: "Pexels (video 7914777)",
  },
  {
    id: "music",
    title: "MUSIC",
    line: "Front row. Bass in the chest.",
    stat: "LOUDER THAN THE CROWD.",
    video: clip("music"),
    credit: "Pexels (video 13442340)",
  },
] as const;
