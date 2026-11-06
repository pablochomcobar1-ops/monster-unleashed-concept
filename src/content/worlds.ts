export type WorldId = "motocross" | "skate" | "bmx" | "surf" | "esports" | "music";

export type World = {
  id: WorldId;
  title: string;
  line: string;
  stat: string;
  /** Free-licence stock clips (Pexels / Pixabay). Files added in Task 10. */
  video: { mp4: string; webm: string; poster: string };
  /** Photographer / videographer credit, filled in when the clip is chosen. */
  credit: string;
};

const clip = (id: WorldId) => ({
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
    video: clip("motocross"),
    credit: "",
  },
  {
    id: "skate",
    title: "SKATE",
    line: "Concrete doesn't forgive. Go anyway.",
    stat: "1 MORE TRY. ALWAYS.",
    video: clip("skate"),
    credit: "",
  },
  {
    id: "bmx",
    title: "BMX",
    line: "Two wheels. Zero plan. Full send.",
    stat: "HANDS OFF. EYES UP.",
    video: clip("bmx"),
    credit: "",
  },
  {
    id: "surf",
    title: "SURF",
    line: "The ocean picks the line. You hold on.",
    stat: "FIRST LIGHT. FIRST WAVE.",
    video: clip("surf"),
    credit: "",
  },
  {
    id: "esports",
    title: "ESPORTS",
    line: "Last round. Last life. No lag.",
    stat: "CLUTCH OR NOTHING.",
    video: clip("esports"),
    credit: "",
  },
  {
    id: "music",
    title: "MUSIC",
    line: "Front row. Bass in the chest.",
    stat: "LOUDER THAN THE CROWD.",
    video: clip("music"),
    credit: "",
  },
] as const;
