import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "#403D3D",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {/* Roof triangle */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "52px solid transparent",
            borderRight: "52px solid transparent",
            borderBottom: "44px solid #059669",
            marginBottom: -2,
          }}
        />
        {/* Body */}
        <div
          style={{
            width: 76,
            height: 56,
            background: "white",
            borderRadius: "0 0 6px 6px",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 0,
          }}
        >
          {/* Door */}
          <div
            style={{
              width: 24,
              height: 32,
              background: "#059669",
              borderRadius: "4px 4px 0 0",
            }}
          />
        </div>
      </div>
    ),
    size,
  )
}
