import type { MetadataRoute } from "next"

import { CATALOG } from "@/lib/catalog"
import { siteConfig } from "@/lib/site-config"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const componentRoutes = CATALOG.map((entry) => `/components/${entry.slug}`)

  return [...siteConfig.routes, ...componentRoutes].map((route) => ({
    url: new URL(route, siteConfig.url).toString(),
    lastModified,
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.8,
  }))
}
