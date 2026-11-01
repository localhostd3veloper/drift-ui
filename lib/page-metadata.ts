import type { Metadata } from "next"

import { siteConfig } from "@/lib/site-config"

const IMAGE_SIZE = { width: 1200, height: 630 }
const COVER_SIZE = { width: 3200, height: 1680 }

export function createPageMetadata({
  title,
  description,
  path,
  imageBasePath = "",
  imageAlt = siteConfig.title,
  cover,
  publishedTime,
}: {
  title: string
  description: string
  path: string
  imageBasePath?: string
  imageAlt?: string
  cover?: { src: string; alt: string }
  publishedTime?: string
}): Metadata {
  const socialTitle = `${title} | ${siteConfig.name}`
  const image = { ...IMAGE_SIZE, alt: imageAlt }
  const coverImage = cover && { ...COVER_SIZE, url: cover.src, alt: cover.alt }

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...(publishedTime
        ? { type: "article", publishedTime }
        : { type: "website" }),
      url: path,
      siteName: siteConfig.name,
      title: socialTitle,
      description,
      locale: "en_US",
      images: [
        coverImage ?? { url: `${imageBasePath}/opengraph-image`, ...image },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [
        coverImage ?? { url: `${imageBasePath}/twitter-image`, ...image },
      ],
    },
  }
}
