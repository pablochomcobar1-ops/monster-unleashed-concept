import { afterEach, describe, expect, test, vi } from "vitest";
import { canUseWebGL } from "./canUseWebGL";

function fakeWebGL(renderer: string | null) {
  const loseContext = vi.fn();
  const gl =
    renderer === null
      ? null
      : {
          RENDERER: 0x1f01,
          getExtension: (name: string) =>
            name === "WEBGL_debug_renderer_info"
              ? { UNMASKED_RENDERER_WEBGL: 0x9246 }
              : name === "WEBGL_lose_context"
                ? { loseContext }
                : null,
          getParameter: () => renderer,
        };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(gl as never);
  return { loseContext };
}

describe("canUseWebGL", () => {
  afterEach(() => vi.restoreAllMocks());

  test("real graphics chip: 3D on, and the test context is freed", () => {
    const { loseContext } = fakeWebGL("ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0)");
    expect(canUseWebGL()).toBe(true);
    expect(loseContext).toHaveBeenCalled();
  });

  test.each([
    "ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver)",
    "llvmpipe (LLVM 15.0.7, 256 bits)",
    "Microsoft Basic Render Driver",
  ])("software renderer %s: flat can", (renderer) => {
    fakeWebGL(renderer);
    expect(canUseWebGL()).toBe(false);
  });

  test("no WebGL at all: flat can", () => {
    fakeWebGL(null);
    expect(canUseWebGL()).toBe(false);
  });
});
