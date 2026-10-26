import { ImageResponse } from "next/og"

import { OG_COLORS, OgLogoMark } from "@/components/seo/og-logo-mark"
import { siteConfig } from "@/lib/site-config"

export const alt = siteConfig.title
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: 80,
        color: OG_COLORS.foreground,
        background: OG_COLORS.background,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <OgLogoMark />
        <span style={{ fontSize: 36, letterSpacing: -1 }}>
          {siteConfig.name}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 84,
          lineHeight: 1.02,
          letterSpacing: -3,
        }}
      >
        <span>The components</span>
        <span style={{ color: OG_COLORS.muted }}>shadcn left out</span>
      </div>
      <span
        style={{
          fontSize: 26,
          color: OG_COLORS.muted,
          fontFamily: "monospace",
        }}
      >
        npx shadcn add @drift-ui/tags-input
      </span>
    </div>,
    size
  )
}
