import { CanvasTexture, SRGBColorSpace } from "three";
import type { Flavor } from "@/content/flavors";

/**
 * Placeholder label, drawn in code: black wrap, a flavour-colour band and the name.
 * When the real label photos arrive, swap this for a TextureLoader on flavor.labelImg.
 */
export function makeLabelTexture(flavor: Flavor): CanvasTexture {
  const w = 1024;
  const h = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Base wrap
  ctx.fillStyle = "#070807";
  ctx.fillRect(0, 0, w, h);

  // Subtle brushed texture
  for (let i = 0; i < 1400; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.025})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 40, 1);
  }

  const display =
    getComputedStyle(document.documentElement).getPropertyValue("--font-oswald").trim() || "Impact, sans-serif";

  // Front panel sits at the centre of the texture (u = 0.5 faces the camera)
  const cx = w / 2;

  // Flavour band
  ctx.fillStyle = flavor.color;
  ctx.fillRect(cx - 90, 0, 180, h);
  ctx.fillStyle = "#070807";
  ctx.fillRect(cx - 70, 0, 6, h);
  ctx.fillRect(cx + 64, 0, 6, h);

  // Vertical name on the band
  ctx.save();
  ctx.translate(cx, h / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = "#070807";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 110px ${display}`;
  ctx.fillText(flavor.name.toUpperCase(), 0, 0, h * 0.86);
  ctx.restore();

  // Side copy (back of the can)
  ctx.fillStyle = flavor.color;
  ctx.font = `700 46px ${display}`;
  ctx.textAlign = "center";
  ctx.fillText("UNLEASHED", w * 0.08, h * 0.5, 120);
  ctx.fillText("CONCEPT", w * 0.92, h * 0.5, 120);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}
