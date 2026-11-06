export type FlavorId =
  | "original"
  | "ultra-white"
  | "ultra-paradise"
  | "mango-loco"
  | "pipeline-punch";

export type Flavor = {
  id: FlavorId;
  name: string;
  sugarFree: boolean;
  /** Flood colour, same value as the matching --color-flavor-* token. */
  color: string;
  tagline: string;
  /** Label numbers: null until read from the owner's India can photos. */
  caffeineMg: number | null;
  sugarG: number | null;
  kcal: number | null;
  servingMl: number | null;
  frontImg: string;
  labelImg: string;
};

export const flavors: readonly Flavor[] = [
  {
    id: "original",
    name: "Original",
    sugarFree: false,
    color: "#A6FF00",
    tagline: "THE ONE THAT STARTED THE NOISE.",
    caffeineMg: null,
    sugarG: null,
    kcal: null,
    servingMl: null,
    frontImg: "/cans/original-front.webp",
    labelImg: "/cans/original-label.webp",
  },
  {
    id: "ultra-white",
    name: "Ultra White",
    sugarFree: true,
    color: "#E8ECEF",
    tagline: "ZERO SUGAR. ZERO MERCY.",
    caffeineMg: null,
    sugarG: null,
    kcal: null,
    servingMl: null,
    frontImg: "/cans/ultra-white-front.webp",
    labelImg: "/cans/ultra-white-label.webp",
  },
  {
    id: "ultra-paradise",
    name: "Ultra Paradise",
    sugarFree: true,
    color: "#2BD4A8",
    tagline: "SUNRISE. FIRST WAVE. NO BRAKES.",
    caffeineMg: null,
    sugarG: null,
    kcal: null,
    servingMl: null,
    frontImg: "/cans/ultra-paradise-front.webp",
    labelImg: "/cans/ultra-paradise-label.webp",
  },
  {
    id: "mango-loco",
    name: "Mango Loco",
    sugarFree: false,
    color: "#FF8A1F",
    tagline: "CHAOS, SERVED COLD.",
    caffeineMg: null,
    sugarG: null,
    kcal: null,
    servingMl: null,
    frontImg: "/cans/mango-loco-front.webp",
    labelImg: "/cans/mango-loco-label.webp",
  },
  {
    id: "pipeline-punch",
    name: "Pipeline Punch",
    sugarFree: false,
    color: "#FF4F8B",
    tagline: "PADDLE OUT. HOLD ON.",
    caffeineMg: null,
    sugarG: null,
    kcal: null,
    servingMl: null,
    frontImg: "/cans/pipeline-punch-front.webp",
    labelImg: "/cans/pipeline-punch-label.webp",
  },
] as const;

export function getFlavor(id: FlavorId): Flavor {
  const flavor = flavors.find((f) => f.id === id);
  if (!flavor) throw new Error(`Unknown flavour: ${id}`);
  return flavor;
}
