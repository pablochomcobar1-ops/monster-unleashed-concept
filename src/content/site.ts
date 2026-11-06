export const site = {
  name: "Monster Unleashed",
  author: "Pablo Chomcobar",
  /** Live address (Vercel). Used for the sitemap, share images and canonical links. */
  url: "https://monster-unleashed-concept.vercel.app",
  /** Your portfolio link for the footer credit. Leave "" to show the name without a link. */
  portfolioUrl: "",
  officialUrl: "https://www.monsterenergy.com/",
  disclaimer: "Concept by Pablo Chomcobar. Not affiliated with Monster Energy.",
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/ingredients", label: "Ingredients" },
  { href: "/used-by", label: "Used By" },
] as const;
