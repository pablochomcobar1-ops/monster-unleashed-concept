import { afterEach, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const webgl = vi.hoisted(() => ({ ok: false, lowPower: false }));
vi.mock("@/lib/canUseWebGL", () => ({
  canUseWebGL: () => webgl.ok,
  isLowPowerDevice: () => webgl.lowPower,
}));
// The real 3D scene can't run in jsdom; a stub proves CanStage chose it.
vi.mock("./CanScene", () => ({
  default: ({ flavor }: { flavor: { name: string } }) => <div data-testid="scene">{flavor.name}</div>,
}));

import { CanStage } from "./CanStage";

describe("CanStage", () => {
  afterEach(() => {
    webgl.ok = false;
    webgl.lowPower = false;
  });

  test("without WebGL shows the flat can, never a canvas", () => {
    render(<CanStage flavorId="original" />);
    expect(screen.getByRole("img", { name: "Original can" })).toBeInTheDocument();
    expect(document.querySelector("canvas")).toBeNull();
  });

  test("on a very weak device shows the flat can", () => {
    webgl.ok = true;
    webgl.lowPower = true;
    render(<CanStage flavorId="mango-loco" />);
    expect(screen.getByRole("img", { name: "Mango Loco can" })).toBeInTheDocument();
    expect(screen.queryByTestId("scene")).toBeNull();
  });

  test("with WebGL loads the 3D scene", async () => {
    webgl.ok = true;
    render(<CanStage flavorId="ultra-white" />);
    expect(await screen.findByTestId("scene")).toHaveTextContent("Ultra White");
  });
});
