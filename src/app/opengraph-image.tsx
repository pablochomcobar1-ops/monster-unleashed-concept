import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Monster Unleashed: concept by Pablo Chomcobar. Not affiliated with Monster Energy.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The preview image shown when the link is shared (WhatsApp, Instagram DMs, LinkedIn, X). */
export default async function OpengraphImage() {
  // Oswald (OFL licence) from @fontsource, read at build time.
  const fontDir = join(process.cwd(), "node_modules/@fontsource/oswald/files");
  const [bold, regular] = await Promise.all([
    readFile(join(fontDir, "oswald-latin-700-normal.woff")),
    readFile(join(fontDir, "oswald-latin-400-normal.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(ellipse at 70% 60%, #2e5a00 0%, #0c110a 45%, #050605 75%)",
          color: "#f2f5ee",
          fontFamily: "Oswald",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 10, color: "#a6ff00", fontWeight: 700 }}>
          MONSTER · UNLEASHED
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 170, fontWeight: 700, lineHeight: 0.95 }}>
          <span>FEAR IS</span>
          <span style={{ color: "#a6ff00" }}>OPTIONAL.</span>
        </div>
        <div style={{ display: "flex", fontSize: 28, fontWeight: 400, color: "#c9d1c2", letterSpacing: 1 }}>
          Concept by Pablo Chomcobar. Not affiliated with Monster Energy.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Oswald", data: bold, weight: 700, style: "normal" },
        { name: "Oswald", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
