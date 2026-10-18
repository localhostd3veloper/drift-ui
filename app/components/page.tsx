import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import type { CatalogCard } from "@/components/docs/component-card"
import { ComponentsBrowser } from "@/components/docs/components-browser"
import { PreviewStage } from "@/components/docs/preview-stage"
import { CATALOG, CATEGORIES } from "@/lib/catalog"
import { createPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = createPageMetadata({
  title: "Components",
  description:
    "Every drift-ui component running live: tags input, tree view, stepper, filter builder, color picker, tour and more. Open any one for its source and install command.",
  path: "/components",
})

const CARDS: CatalogCard[] = CATALOG.map((entry) => ({
  slug: entry.slug,
  name: entry.name,
  description: entry.description,
  category: entry.category,
  thumbnail: <PreviewStage entry={entry} />,
}))

export default function ComponentsPage() {
  return (
    <main className="flex flex-col gap-12">
      <header className="flex flex-col gap-6">
        <h1 className="rise text-5xl leading-[1.02] font-medium tracking-tight md:text-6xl">
          Components
        </h1>
        <p className="max-w-[52ch] rise text-lg leading-relaxed text-muted-foreground [--rise-delay:80ms]">
          {CATALOG.length} components you install with the shadcn CLI and own as
          source. Every preview here is the real component.
        </p>
        <Link
          href="/#install"
          className="group flex w-fit rise items-center gap-1.5 text-sm text-muted-foreground transition-colors [--rise-delay:160ms] hover:text-foreground"
        >
          First time? Register the @drift-ui namespace
          <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </header>
      <ComponentsBrowser categories={CATEGORIES} cards={CARDS} />
    </main>
  )
}
