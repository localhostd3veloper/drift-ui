import { ImageResponse } from "next/og"

import { loadOgFonts, OgFrame } from "@/components/seo/og-frame"
import { OG_COLORS } from "@/components/seo/og-logo-mark"
import { siteConfig } from "@/lib/site-config"

export const alt = `Open source guides from the ${siteConfig.name} maintainers`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function ResourcesOpenGraphImage() {
  return new ImageResponse(
    <OgFrame breadcrumb="Resources">
      <span
        style={{
          fontFamily: "Display",
          fontSize: 104,
          fontWeight: 600,
          lineHeight: 1,
          letterSpacing: -4,
        }}
      >
        Open source guides
      </span>
      <span
        style={{
          maxWidth: 940,
          marginTop: 24,
          fontSize: 32,
          lineHeight: 1.3,
          color: OG_COLORS.muted,
        }}
      >
        First pull requests, coding agents and more
      </span>
    </OgFrame>,
    { ...size, fonts: await loadOgFonts() }
  )
}
