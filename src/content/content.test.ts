import { describe, expect, test } from "vitest";
import { flavors, getFlavor, type FlavorId } from "./flavors";
import { worlds } from "./worlds";
import { pickFlavor, pickerQuestions, type PickerAnswers } from "./picker";

const SPEC_COLORS: Record<FlavorId, string> = {
  original: "#A6FF00",
  "ultra-white": "#E8ECEF",
  "ultra-paradise": "#2BD4A8",
  "mango-loco": "#FF8A1F",
  "pipeline-punch": "#FF4F8B",
};

describe("flavors", () => {
  test("5 flavours in spec order with unique ids", () => {
    expect(flavors.map((f) => f.id)).toEqual([
      "original",
      "ultra-white",
      "ultra-paradise",
      "mango-loco",
      "pipeline-punch",
    ]);
    expect(new Set(flavors.map((f) => f.id)).size).toBe(5);
  });

  test("colours are valid hex and match the design tokens", () => {
    for (const f of flavors) {
      expect(f.color).toMatch(/^#[0-9A-F]{6}$/i);
      expect(f.color).toBe(SPEC_COLORS[f.id]);
    }
  });

  test("only the two Ultras are sugar-free", () => {
    expect(flavors.filter((f) => f.sugarFree).map((f) => f.id)).toEqual([
      "ultra-white",
      "ultra-paradise",
    ]);
  });

  test("label numbers stay null until read from real can photos", () => {
    for (const f of flavors) {
      expect([f.caffeineMg, f.sugarG, f.kcal, f.servingMl]).toEqual([null, null, null, null]);
    }
  });

  test("getFlavor finds by id and throws on unknown", () => {
    expect(getFlavor("mango-loco").name).toBe("Mango Loco");
    expect(() => getFlavor("nope" as FlavorId)).toThrow();
  });

  test("taglines make no energy or health claims", () => {
    for (const f of flavors) {
      expect(f.tagline.toLowerCase()).not.toMatch(/energy|boost|health|vitamin/);
    }
  });
});

describe("worlds", () => {
  test("6 worlds in spec order", () => {
    expect(worlds.map((w) => w.id)).toEqual(["motocross", "skate", "bmx", "surf", "esports", "music"]);
  });
});

describe("pickFlavor", () => {
  const allAnswers: PickerAnswers[] = [];
  for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) for (let c = 0; c < 3; c++) allAnswers.push([a, b, c]);

  test("3 questions with 3 options each", () => {
    expect(pickerQuestions).toHaveLength(3);
    for (const q of pickerQuestions) expect(q.options).toHaveLength(3);
  });

  test("every one of the 27 combinations returns a real flavour", () => {
    const ids = flavors.map((f) => f.id);
    for (const answers of allAnswers) expect(ids).toContain(pickFlavor(answers));
  });

  test("every flavour can be reached", () => {
    const reached = new Set(allAnswers.map(pickFlavor));
    expect(reached.size).toBe(5);
  });

  test("rejects an answer outside 0-2", () => {
    expect(() => pickFlavor([3, 0, 0] as PickerAnswers)).toThrow();
  });
});
