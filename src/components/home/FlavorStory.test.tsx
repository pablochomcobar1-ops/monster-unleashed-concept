import { afterEach, describe, expect, test, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { SoundProvider } from "@/components/sound/SoundProvider";

vi.mock("@/lib/canUseWebGL", () => ({ canUseWebGL: () => false, isLowPowerDevice: () => false }));
vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

import { FlavorStory } from "./FlavorStory";
import { Hero } from "./Hero";

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

// jsdom has no IntersectionObserver (used by motion's whileInView)
class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
vi.stubGlobal("IntersectionObserver", IO);

const renderStory = () => render(<SoundProvider><FlavorStory /></SoundProvider>);

describe("Hero", () => {
  test("headline reads FEAR IS OPTIONAL. and links to the picker", () => {
    mockReducedMotion(false);
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("FEAR IS OPTIONAL.");
    expect(screen.getByRole("link", { name: /pick your beast/i })).toHaveAttribute("href", "#picker");
    expect(screen.getByRole("link", { name: /meet the lineup/i })).toHaveAttribute("href", "#lineup");
  });
});

describe("FlavorStory", () => {
  afterEach(() => vi.restoreAllMocks());

  test("has the 5 flavours in spec order, each a labelled section", () => {
    mockReducedMotion(false);
    renderStory();
    const names = ["Original", "Ultra White", "Ultra Paradise", "Mango Loco", "Pipeline Punch"];
    expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual(names);
    for (const name of names) {
      const section = screen.getByRole("region", { name });
      expect(within(section).getByRole("heading", { level: 2 })).toHaveTextContent(name);
    }
  });

  test("pins the can when motion is allowed", () => {
    mockReducedMotion(false);
    renderStory();
    expect(document.querySelector('[data-pinned="true"]')).not.toBeNull();
  });

  test("reduced motion: nothing pinned, a flat can per flavour", () => {
    mockReducedMotion(true);
    renderStory();
    expect(document.querySelector('[data-pinned="true"]')).toBeNull();
    expect(screen.getAllByRole("img", { name: /can$/ })).toHaveLength(5);
  });
});
