import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ComponentHeader } from "@/components/docs/component-header"
import { DocSection } from "@/components/docs/doc-section"
import { InstallPanel } from "@/components/docs/install-panel"
import { Pager } from "@/components/docs/pager"
import { PreviewStage } from "@/components/docs/preview-stage"
import { PreviewTabs } from "@/components/docs/preview-tabs"
import { SourceFiles } from "@/components/docs/source-files"
import { JsonLd } from "@/components/seo/json-ld"
import { COMPONENT_USAGE } from "@/lib/agent-docs/component-usage"
import {
  CATALOG,
  findCategory,
  findEntry,
  findNeighbors,
  type CatalogEntry,
} from "@/lib/catalog"
import {
  listInstallPaths,
  loadSources,
  loadUsage,
  resolveBuildsOn,
} from "@/lib/component-docs"
import { createPageMetadata } from "@/lib/page-metadata"
import { siteConfig } from "@/lib/site-config"

type ComponentPageProps = { params: Promise<{ slug: string }> }

function buildComponentSchema(entry: CatalogEntry) {
  const pageUrl = `${siteConfig.url}/components/${entry.slug}`

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Components",
            item: `${siteConfig.url}/components`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: entry.name,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "SoftwareSourceCode",
        name: `${entry.name} for shadcn/ui`,
        description: entry.description,
        url: pageUrl,
        codeRepository: `${siteConfig.url}/r/${entry.slug}.json`,
        programmingLanguage: ["TypeScript", "React"],
        runtimePlatform: "React",
        keywords: [
          "shadcn",
          findCategory(entry.category)?.label,
          entry.name,
        ].filter(Boolean),
        isPartOf: {
          "@type": "WebSite",
          name: siteConfig.name,
          url: siteConfig.url,
        },
      },
    ],
  }
}

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

export default async function ComponentPage({ params }: ComponentPageProps) {
  const { slug } = await params
  const entry = findEntry(slug)
  if (!entry) notFound()

  const [usage, sources] = await Promise.all([
    loadUsage(entry),
    loadSources(entry),
  ])
  const notes = COMPONENT_USAGE[entry.slug]?.notes
  const { previous, next } = findNeighbors(entry.slug)

  return (
    <main className="flex max-w-4xl flex-col gap-16">
      <JsonLd schema={buildComponentSchema(entry)} />
      <ComponentHeader entry={entry} />
      <div className="-mt-4 rise [--rise-delay:120ms]">
        <PreviewTabs preview={<PreviewStage entry={entry} />} usage={usage} />
      </div>
      <DocSection id="installation" title="Installation">
        <InstallPanel
          slug={entry.slug}
          dependencies={entry.dependencies}
          buildsOn={resolveBuildsOn(entry)}
          installPaths={listInstallPaths(entry)}
        />
      </DocSection>
      {notes && (
        <DocSection id="notes" title="Notes">
          <p className="max-w-[68ch] leading-relaxed text-muted-foreground">
            {notes}
          </p>
        </DocSection>
      )}
      <DocSection id="source" title="Source">
        <SourceFiles files={sources} />
      </DocSection>
      <Pager previous={previous} next={next} />
    </main>
  )
}
