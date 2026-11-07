import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon for phones (iOS "Add to Home Screen"). Same bolt as icon.svg. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#050605" }}>
        <svg width="132" height="132" viewBox="0 0 64 64">
          <path d="M37 6 15 36h14l-4 22 24-32H35l2-20z" fill="#A6FF00" />
        </svg>
      </div>
    ),
    size,
  );
}
