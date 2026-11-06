export type Credit = {
  who: string;
  source: "Unsplash" | "Pexels" | "Pixabay" | "Freesound";
  url: string;
  /** What it's used for, e.g. "Motocross video". */
  usedFor: string;
};

/** Every stock photo, video and sound gets an entry here. Shown in the footer. */
export const credits: Credit[] = [];
