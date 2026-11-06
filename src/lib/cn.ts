import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Our custom text-* sizes must be registered, or tailwind-merge
// would treat `text-brand` and `text-hero01` as the same group and drop one.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "hero01",
            "hero02",
            "heading01",
            "heading02",
            "heading03",
            "body01",
            "body02",
            "caption01",
            "caption02",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
