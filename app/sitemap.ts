import type { MetadataRoute } from "next"

import { CATALOG } from "@/lib/catalog"
import { componentPath, PRIMITIVE_LIBRARIES } from "@/lib/primitive-library"
import { siteConfig } from "@/lib/site-config"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const componentRoutes = PRIMITIVE_LIBRARIES.flatMap(({ value }) =>
    CATALOG.map((entry) => componentPath(entry.slug, value))
  )

  return [...siteConfig.routes, ...componentRoutes].map((route) => ({
    url: new URL(route, siteConfig.url).toString(),
    lastModified,
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.8,
  }))
}
