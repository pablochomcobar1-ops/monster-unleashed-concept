export type WorldId = "motocross" | "skate" | "bmx" | "surf" | "esports" | "music";

export type WorldVideo = { mp4: string; webm: string; poster: string };

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- used once the clips arrive
const clip = (id: WorldId): WorldVideo => ({
  mp4: `/video/${id}.mp4`,
  webm: `/video/${id}.webm`,
  poster: `/video/${id}-poster.webp`,
});

export const worlds: readonly World[] = [
  {
    id: "motocross",
    title: "MOTOCROSS",
    line: "Dirt in the teeth. Throttle wide open.",
    stat: "AIRTIME > GROUND TIME",
    video: null, // clip("motocross") once the files are in public/video
    credit: "",
  },
  {
    id: "skate",
    title: "SKATE",
    line: "Concrete doesn't forgive. Go anyway.",
    stat: "1 MORE TRY. ALWAYS.",
    video: null, // clip("skate") once the files are in public/video
    credit: "",
  },
  {
    id: "bmx",
    title: "BMX",
    line: "Two wheels. Zero plan. Full send.",
    stat: "HANDS OFF. EYES UP.",
    video: null, // clip("bmx") once the files are in public/video
    credit: "",
  },
  {
    id: "surf",
    title: "SURF",
    line: "The ocean picks the line. You hold on.",
    stat: "FIRST LIGHT. FIRST WAVE.",
    video: null, // clip("surf") once the files are in public/video
    credit: "",
  },
  {
    id: "esports",
    title: "ESPORTS",
    line: "Last round. Last life. No lag.",
    stat: "CLUTCH OR NOTHING.",
    video: null, // clip("esports") once the files are in public/video
    credit: "",
  },
  {
    id: "music",
    title: "MUSIC",
    line: "Front row. Bass in the chest.",
    stat: "LOUDER THAN THE CROWD.",
    video: null, // clip("music") once the files are in public/video
    credit: "",
  },
] as const;
