export type Credit = {
  who: string;
  source: "Unsplash" | "Pexels" | "Pixabay" | "Freesound";
  url: string;
  /** What it's used for, e.g. "Motocross video". */
  usedFor: string;
};

/** Every stock photo, video and sound gets an entry here. Shown in the footer. */
export const credits: Credit[] = [
  { who: "Video 12294780", source: "Pexels", url: "https://www.pexels.com/video/12294780/", usedFor: "Motocross" },
  { who: "Video 9723988", source: "Pexels", url: "https://www.pexels.com/video/9723988/", usedFor: "Skate" },
  { who: "Video 7935585", source: "Pexels", url: "https://www.pexels.com/video/7935585/", usedFor: "BMX" },
  { who: "Video 12855866", source: "Pexels", url: "https://www.pexels.com/video/12855866/", usedFor: "Surf" },
  { who: "Video 7914777", source: "Pexels", url: "https://www.pexels.com/video/7914777/", usedFor: "Esports" },
  { who: "Video 13442340", source: "Pexels", url: "https://www.pexels.com/video/13442340/", usedFor: "Music" },
];
