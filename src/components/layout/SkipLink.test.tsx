import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkipLink } from "./SkipLink";

test("skip link jumps to the main content", () => {
  render(<SkipLink />);
  expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute(
    "href",
    "#main",
  );
});
