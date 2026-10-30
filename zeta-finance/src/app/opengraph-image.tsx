import { ImageResponse } from "next/og";

export const alt = "Zeta Finance — Asesor financiero en Salta";
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
          background: "#f6f4ef",
          color: "#1e3a34",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              background: "#1f6b45",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 700,
              marginRight: 20,
            }}
          >
            Z
          </div>
          <div style={{ fontSize: 28, letterSpacing: 4, fontWeight: 700 }}>
            ZETA FINANCE
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 64, lineHeight: 1.08, fontWeight: 700 }}>
            Asesor financiero en Salta
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 30,
              color: "#3d524c",
              maxWidth: 920,
            }}
          >
            Asesoría personal e inversiones, con acompañamiento cercano.
          </div>
        </div>
        <div style={{ fontSize: 24, color: "#3d524c" }}>Salta, Argentina</div>
      </div>
    ),
    { ...size },
  );
}
