import { ImageResponse } from "next/og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#403D3D",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px 100px",
          position: "relative",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "#059669",
            opacity: 0.15,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            right: 200,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "#0d9488",
            opacity: 0.1,
          }}
        />

        {/* Logo row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 48,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "#059669",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* mini house */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: 0, height: 0,
                  borderLeft: "13px solid transparent",
                  borderRight: "13px solid transparent",
                  borderBottom: "11px solid white",
                  marginBottom: -1,
                }}
              />
              <div
                style={{
                  width: 20, height: 14,
                  background: "white",
                  borderRadius: "0 0 2px 2px",
                }}
              />
            </div>
          </div>
          <span style={{ color: "white", fontSize: 32, fontWeight: 800, letterSpacing: -0.5 }}>
            homs<span style={{ color: "#34d399" }}>byspl</span>
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "white",
            lineHeight: 1,
            letterSpacing: -2,
            marginBottom: 24,
          }}
        >
          Stay like you
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: -2,
            marginBottom: 40,
            background: "linear-gradient(135deg, #059669, #0d9488)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          live there.
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 26,
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.4,
            maxWidth: 700,
          }}
        >
          Premium furnished shortlet apartments in Abuja.
          All utilities included. Instant booking.
        </div>

        {/* Location pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 44,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 100,
            padding: "10px 20px",
          }}
        >
          <div
            style={{
              width: 8, height: 8,
              borderRadius: "50%",
              background: "#34d399",
            }}
          />
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 18, fontWeight: 600 }}>
            Jabi · Maitama · Wuse II · Asokoro · Abuja FCT
          </span>
        </div>
      </div>
    ),
    size,
  )
}
