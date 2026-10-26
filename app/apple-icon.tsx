import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: "#0a0a0a",
      }}
    >
      <svg width="108" height="108" viewBox="0 0 40 40" fill="#fafafa">
        <rect x="3" y="10" width="12" height="12" rx="3" />
        <rect x="3" y="25" width="12" height="12" rx="3" />
        <rect x="18" y="25" width="12" height="12" rx="3" />
        <rect
          x="25"
          y="3"
          width="12"
          height="12"
          rx="3"
          fill="#8ab4ff"
          transform="rotate(10 31 9)"
        />
      </svg>
    </div>,
    size
  )
}
