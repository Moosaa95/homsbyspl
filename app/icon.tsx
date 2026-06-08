import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "#403D3D",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Roof */}
        <div
          style={{
            position: "absolute",
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderBottom: "9px solid #059669",
            top: 6,
            left: 6,
          }}
        />
        {/* House body */}
        <div
          style={{
            position: "absolute",
            width: 13,
            height: 10,
            background: "white",
            borderRadius: "0 0 2px 2px",
            bottom: 6,
            left: 9.5,
          }}
        />
        {/* Door */}
        <div
          style={{
            position: "absolute",
            width: 4,
            height: 6,
            background: "#059669",
            borderRadius: "1px 1px 0 0",
            bottom: 6,
            left: 14,
          }}
        />
      </div>
    ),
    size,
  )
}
