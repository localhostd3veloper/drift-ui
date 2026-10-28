import type { Metadata } from "next"

import { ComponentPage } from "@/app/components/[slug]/component-page"
import { CATALOG, findEntry } from "@/lib/catalog"
import { createPageMetadata } from "@/lib/page-metadata"
import { siteConfig } from "@/lib/site-config"

type ComponentPageProps = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return CATALOG.map((entry) => ({ slug: entry.slug }))
}

export async function generateMetadata({
  params,
}: ComponentPageProps): Promise<Metadata> {
  const { slug } = await params
  const entry = findEntry(slug)
  if (!entry) return {}

  return createPageMetadata({
    title: entry.name,
    description: `${entry.description} Install with npx shadcn@latest add @drift-ui/${entry.slug}.`,
    path: `/components/${entry.slug}`,
    imageBasePath: `/components/${entry.slug}`,
    imageAlt: `${entry.name}, a ${siteConfig.name} component for shadcn/ui`,
  })
}

export default async function RadixComponentPage({
  params,
}: ComponentPageProps) {
  const { slug } = await params
  return <ComponentPage slug={slug} library="radix" />
}
