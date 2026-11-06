import { afterEach, describe, expect, test, vi } from "vitest";
import { render } from "@testing-library/react";
import { Atmosphere, setFlood } from "./Atmosphere";

function mockReducedMotion(matches: boolean) {
  vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
    matches: query.includes("reduce") ? matches : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe("Atmosphere", () => {
  afterEach(() => vi.restoreAllMocks());

  test("animates fog and grain normally", () => {
    mockReducedMotion(false);
    const { container } = render(<Atmosphere />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute("data-motion", "on");
    expect(root.querySelector(".atmo-drift-a")).not.toBeNull();
    expect(root.querySelector(".atmo-grain-shift")).not.toBeNull();
  });

  test("stops all animation when reduced motion is on", () => {
    mockReducedMotion(true);
    const { container } = render(<Atmosphere />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute("data-motion", "off");
    expect(root.querySelector(".atmo-drift-a, .atmo-drift-b, .atmo-grain-shift")).toBeNull();
  });

  test("is hidden from screen readers and never blocks clicks", () => {
    mockReducedMotion(false);
    const { container } = render(<Atmosphere />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root.className).toContain("pointer-events-none");
  });

  test("setFlood changes the glow colour", () => {
    setFlood("#FF8A1F");
    expect(document.documentElement.style.getPropertyValue("--flood")).toBe("#FF8A1F");
  });
});
