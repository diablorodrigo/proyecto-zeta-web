import { ImageResponse } from "next/og";

export const alt = "¿Cuánto pierde tu plata quieta?";
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
          background: "#f7f6f2",
          color: "#1e3a34",
          padding: "72px",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 4 }}>ZETA FINANCE</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, lineHeight: 1.08, fontWeight: 700 }}>
            ¿Cuánto pierde tu plata quieta?
          </div>
          <div style={{ marginTop: 24, fontSize: 30, color: "#3d524c", maxWidth: 860 }}>
            Mirá, en un minuto, cuánto poder de compra se va si la dejás en la cuenta.
          </div>
        </div>
        <div style={{ fontSize: 24 }}>Simulación educativa. No es una recomendación.</div>
      </div>
    ),
    { ...size },
  );
}
