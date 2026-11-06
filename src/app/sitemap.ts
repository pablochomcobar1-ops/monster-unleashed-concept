import type { MetadataRoute } from "next";
import { navLinks, site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return navLinks.map((link) => ({
    url: `${site.url}${link.href === "/" ? "" : link.href}`,
    changeFrequency: "monthly",
    priority: link.href === "/" ? 1 : 0.7,
  }));
}
