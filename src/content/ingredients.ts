export type Ingredient = {
  id: string;
  name: string;
  /** What it is, in plain words. No health or performance claims. */
  what: string;
  /** Where else people already meet it. */
  alsoIn: string;
};

/**
 * Main ingredients as listed for Monster in India (caffeinated beverage with taurine,
 * glucuronolactone, inositol and B-vitamins). Exact amounts vary by flavour:
 * confirm against the owner's label photos.
 */
export const ingredients: readonly Ingredient[] = [
  {
    id: "caffeine",
    name: "Caffeine",
    what: "A stimulant. The main active ingredient, and the reason it's labelled a caffeinated beverage.",
    alsoIn: "Coffee, tea, cola",
  },
  {
    id: "taurine",
    name: "Taurine",
    what: "An amino acid. Your body makes some on its own.",
    alsoIn: "Meat, fish, dairy",
  },
  {
    id: "glucuronolactone",
    name: "Glucuronolactone",
    what: "A compound your body produces naturally when it breaks down glucose.",
    alsoIn: "Some plant gums",
  },
  {
    id: "inositol",
    name: "Inositol",
    what: "A sugar-like compound your body makes, once grouped with the B-vitamins.",
    alsoIn: "Fruit, beans, grains",
  },
  {
    id: "b-vitamins",
    name: "B-vitamins",
    what: "A group of vitamins (such as B3, B6 and B12). The label lists which ones.",
    alsoIn: "Eggs, dairy, whole grains",
  },
  {
    id: "sugar",
    name: "Sugar or sweeteners",
    what: "Sugar in the full-sugar flavours. The Ultra (zero sugar) range uses sweeteners instead.",
    alsoIn: "Soft drinks, sweets",
  },
] as const;
