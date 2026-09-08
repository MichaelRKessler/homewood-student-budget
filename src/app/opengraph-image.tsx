import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0e2340",
          color: "#fff8ee",
          padding: "72px",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#e6d3a3",
          }}
        >
          Johns Hopkins Homewood
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, lineHeight: 0.95, fontWeight: 600 }}>
            Homewood on a Budget
          </div>
          <div style={{ marginTop: 24, fontSize: 32, color: "#f3ead8", maxWidth: 820 }}>
            Cheap eats, student deals, and late-night spots you can walk to.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
