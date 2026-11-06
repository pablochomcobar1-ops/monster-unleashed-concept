/** Renderer names that mean "3D drawn by the CPU, no graphics chip": far too slow for our scene. */
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render|mesa offscreen/i;

/**
 * True when the browser can draw our 3D can smoothly: WebGL is available AND it runs on a real
 * graphics chip. Software rendering (test browsers, remote desktops, blocked GPU drivers) would
 * freeze the page, so those visitors get the flat can instead. Always false on the server.
 */
export function canUseWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ?? canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;

    const debug = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(gl.getParameter(debug ? debug.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? "");
    gl.getExtension("WEBGL_lose_context")?.loseContext(); // free the test context straight away

    return !SOFTWARE_RENDERER.test(renderer);
  } catch {
    return false;
  }
}

/** Very weak devices get the flat can instead of 3D. */
export function isLowPowerDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const cores = navigator.hardwareConcurrency;
  return typeof cores === "number" && cores > 0 && cores <= 2;
}
