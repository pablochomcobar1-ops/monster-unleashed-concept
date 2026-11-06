import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutPage, { metadata } from "./page";

class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
vi.stubGlobal("IntersectionObserver", IO);

describe("About page", () => {
  test("has one h1 and the three story chapters", () => {
    render(<AboutPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    for (const name of ["The attitude", "The claw", "No fear"]) {
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument();
    }
  });

  test("states the concept disclaimer word for word", () => {
    render(<AboutPage />);
    expect(screen.getByText("Concept by Pablo Chomcobar. Not affiliated with Monster Energy.")).toBeInTheDocument();
  });

  test("makes no energy or health claims", () => {
    const { container } = render(<AboutPage />);
    expect(container.textContent?.toLowerCase()).not.toMatch(/energy drink|boosts?|vitamin|healthy/);
  });

  test("page title is About", () => {
    expect(metadata.title).toBe("About");
  });
});
