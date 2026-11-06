import { describe, expect, test, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { flavors, type Flavor } from "@/content/flavors";
import { StatStrip, formatStat } from "@/components/ingredients/StatStrip";
import IngredientsPage, { metadata } from "./page";

class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
vi.stubGlobal("IntersectionObserver", IO);

describe("StatStrip", () => {
  test("missing numbers show a dash, never 0 or NaN", () => {
    const { container } = render(<StatStrip flavor={flavors[0]} />);
    const values = within(container).getAllByRole("definition").map((d) => d.textContent);
    expect(values).toEqual(["—", "—", "—"]);
    expect(container.textContent).not.toMatch(/\b0 mg|NaN/);
  });

  test("real numbers show with their unit", () => {
    const filled: Flavor = { ...flavors[0], caffeineMg: 160, sugarG: 27, kcal: 110, servingMl: 350 };
    const { container } = render(<StatStrip flavor={filled} />);
    expect(container).toHaveTextContent("160 mg");
    expect(container).toHaveTextContent("27 g");
    expect(container).toHaveTextContent("110 kcal");
    expect(container).toHaveTextContent("Per 350 ml can.");
  });

  test("formatStat handles bad values safely", () => {
    expect(formatStat(null, "mg")).toBe("—");
    expect(formatStat(Number.NaN, "mg")).toBe("—");
    expect(formatStat(0, "g")).toBe("0 g");
  });
});

describe("Ingredients page", () => {
  test("lists the blend and all 5 flavours", () => {
    render(<IngredientsPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    for (const name of ["Caffeine", "Taurine", "B-vitamins"]) {
      expect(screen.getByRole("heading", { level: 3, name })).toBeInTheDocument();
    }
    for (const f of flavors) {
      expect(screen.getByRole("heading", { level: 3, name: f.name })).toBeInTheDocument();
    }
  });

  test("has the responsible-use note", () => {
    render(<IngredientsPage />);
    const note = screen.getByRole("region", { name: /ride smart/i });
    expect(note).toHaveTextContent(/under 18/i);
    expect(note).toHaveTextContent(/pregnant/i);
    expect(note).toHaveTextContent(/daily caffeine/i);
  });

  test("calls it a caffeinated beverage and makes no health claims", () => {
    const { container } = render(<IngredientsPage />);
    const text = container.textContent!.toLowerCase();
    expect(text).toContain("caffeinated beverage");
    expect(text).not.toMatch(/energy drink|boosts?|improves?|healthy|performance/);
  });

  test("page title is Ingredients", () => {
    expect(metadata.title).toBe("Ingredients");
  });
});
