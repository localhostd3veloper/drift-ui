import type { Metadata } from "next"

import { alt } from "./opengraph-image"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteNav } from "@/components/landing/site-nav"
import {
  ResourceFeature,
  ResourceRow,
} from "@/components/resources/resource-card"
import { ResourcesBrowser } from "@/components/resources/resources-browser"
import { createPageMetadata } from "@/lib/page-metadata"
import { RESOURCE_TAGS, RESOURCES, resourceSearchText } from "@/lib/resources"

export const metadata: Metadata = createPageMetadata({
  title: "Open source guides for first-time contributors",
  description:
    "Guides from the drift-ui maintainers on open source, first pull requests, coding agents and building a component registry.",
  path: "/resources",
  imageBasePath: "/resources",
  imageAlt: alt,
})

export default function ResourcesPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteNav />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 pt-8 pb-28 md:gap-10 md:px-10">
        <header className="flex flex-col gap-4 border-b pb-6 md:pb-9">
          <span className="rise font-mono text-xs tracking-widest text-brand uppercase">
            Resources
          </span>
          <h1 className="max-w-5xl rise font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-balance [--rise-delay:80ms]">
            Posts from the <span className="whitespace-nowrap">drift-ui</span>{" "}
            maintainers
          </h1>
          <p className="max-w-[52ch] rise leading-relaxed text-muted-foreground [--rise-delay:160ms]">
            How the registry gets made, and how to make your first open source
            contribution.
          </p>
        </header>

        <ResourcesBrowser
          tags={RESOURCE_TAGS}
          feature={<ResourceFeature resource={RESOURCES[0]} />}
          listings={RESOURCES.map((resource) => ({
            slug: resource.slug,
            tags: resource.tags,
            searchText: resourceSearchText(resource),
            row: <ResourceRow resource={resource} />,
          }))}
        />
      </main>
      <SiteFooter />
    </div>
  )
}
