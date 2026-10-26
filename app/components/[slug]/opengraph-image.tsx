import { ImageResponse } from "next/og"

import { OG_COLORS, OgLogoMark } from "@/components/seo/og-logo-mark"
import { CATALOG, findCategory, findEntry } from "@/lib/catalog"
import { siteConfig } from "@/lib/site-config"

export const alt = `A ${siteConfig.name} component`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export function generateStaticParams() {
  return CATALOG.map((entry) => ({ slug: entry.slug }))
}

export default async function ComponentOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const entry = findEntry(slug)
  const name = entry?.name ?? siteConfig.name
  const category = entry ? findCategory(entry.category)?.label : undefined

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
        {category && (
          <span style={{ fontSize: 28, color: OG_COLORS.muted }}>
            / {category}
          </span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <span style={{ fontSize: 96, lineHeight: 1, letterSpacing: -4 }}>
          {name}
        </span>
        {entry && (
          <span
            style={{
              maxWidth: 940,
              fontSize: 34,
              lineHeight: 1.3,
              color: OG_COLORS.muted,
            }}
          >
            {entry.description}
          </span>
        )}
      </div>
      <span
        style={{
          fontSize: 26,
          color: OG_COLORS.muted,
          fontFamily: "monospace",
        }}
      >
        npx shadcn add @drift-ui/{slug}
      </span>
    </div>,
    size
  )
}
