import type { Metadata } from "next"

import { siteConfig } from "@/lib/site-config"

const IMAGE_SIZE = { width: 1200, height: 630 }

export function createPageMetadata({
  title,
  description,
  path,
  imageBasePath = "",
  imageAlt = siteConfig.title,
}: {
  title: string
  description: string
  path: string
  imageBasePath?: string
  imageAlt?: string
}): Metadata {
  const socialTitle = `${title} | ${siteConfig.name}`
  const image = { ...IMAGE_SIZE, alt: imageAlt }

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: siteConfig.name,
      title: socialTitle,
      description,
      locale: "en_US",
      images: [{ url: `${imageBasePath}/opengraph-image`, ...image }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [{ url: `${imageBasePath}/twitter-image`, ...image }],
    },
  }
}
