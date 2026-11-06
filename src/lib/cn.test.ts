import { expect, test } from "vitest";
import { cn } from "./cn";

test("keeps a colour and a custom size together", () => {
  expect(cn("text-brand", "text-hero01")).toBe("text-brand text-hero01");
});

test("later size wins over an earlier size", () => {
  expect(cn("text-body01", "text-heading02")).toBe("text-heading02");
});
