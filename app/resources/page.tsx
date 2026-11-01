import type { Metadata } from "next"

import { alt } from "./opengraph-image"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteNav } from "@/components/landing/site-nav"
import {
  ResourceFeature,
  ResourceRow,
} from "@/components/resources/resource-card"
import { createPageMetadata } from "@/lib/page-metadata"
import { RESOURCES } from "@/lib/resources"

export const metadata: Metadata = createPageMetadata({
  title: "Open source guides for first-time contributors",
  description:
    "Guides from the drift-ui maintainers on open source, first pull requests, coding agents and building a component registry.",
  path: "/resources",
  imageBasePath: "/resources",
  imageAlt: alt,
})

export default function ResourcesPage() {
  const [featured, ...rest] = RESOURCES

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteNav />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-4 pt-14 pb-28 md:gap-16 md:px-10 md:pt-20">
        <header className="flex flex-col gap-6 border-b pb-10 md:pb-14">
          <span className="rise font-mono text-xs tracking-widest text-brand uppercase">
            Resources
          </span>
          <h1 className="max-w-5xl rise font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] font-semibold tracking-[-0.04em] text-balance [--rise-delay:80ms]">
            Posts from the <span className="whitespace-nowrap">drift-ui</span>{" "}
            maintainers
          </h1>
          <p className="max-w-[52ch] rise text-lg leading-relaxed text-muted-foreground [--rise-delay:160ms]">
            How the registry gets made, and how to make your first open source
            contribution.
          </p>
        </header>

        <ResourceFeature resource={featured} />

        <ul className="flex flex-col border-t">
          {rest.map((resource) => (
            <li key={resource.slug} className="border-b">
              <ResourceRow resource={resource} />
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </div>
  )
}
