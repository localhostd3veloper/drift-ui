import { ImageResponse } from "next/og"

import { loadOgFonts, OgCommand, OgFrame } from "@/components/seo/og-frame"
import { OG_COLORS } from "@/components/seo/og-logo-mark"
import { CATALOG, findCategory, findEntry } from "@/lib/catalog"
import { PRIMITIVE_LIBRARIES } from "@/lib/primitive-library"
import { siteConfig } from "@/lib/site-config"

export const alt = `A ${siteConfig.name} component`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export function generateStaticParams() {
  return PRIMITIVE_LIBRARIES.flatMap(({ value }) =>
    CATALOG.map((entry) => ({ library: value, slug: entry.slug }))
  )
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
    <OgFrame breadcrumb={category}>
      <span
        style={{
          fontFamily: "Display",
          fontSize: 104,
          fontWeight: 600,
          lineHeight: 1,
          letterSpacing: -4,
        }}
      >
        {name}
      </span>
      {entry && (
        <span
          style={{
            maxWidth: 940,
            marginTop: 24,
            marginBottom: 34,
            fontSize: 32,
            lineHeight: 1.3,
            color: OG_COLORS.muted,
          }}
        >
          {entry.description}
        </span>
      )}
      <OgCommand command={`npx shadcn add @drift-ui/${slug}`} />
    </OgFrame>,
    { ...size, fonts: await loadOgFonts() }
  )
}
