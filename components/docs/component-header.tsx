import Link from "next/link"
import { ArrowUpRightIcon, ChevronRightIcon } from "lucide-react"

import { findCategory, type CatalogEntry } from "@/lib/catalog"

export function ComponentHeader({ entry }: { entry: CatalogEntry }) {
  const category = findCategory(entry.category)

  return (
    <header className="flex rise flex-col gap-5">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground"
      >
        <Link
          href="/components"
          className="transition-colors hover:text-foreground"
        >
          Components
        </Link>
        <ChevronRightIcon className="size-3 opacity-60" />
        <span>{category?.label}</span>
      </nav>
      <h1 className="text-4xl leading-[1.05] font-medium tracking-tight md:text-5xl">
        {entry.name}
      </h1>
      <p className="max-w-[58ch] text-lg leading-relaxed text-muted-foreground">
        {entry.description}
      </p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-muted-foreground">
        <code className="text-foreground">@drift-ui/{entry.slug}</code>
        {entry.category === "primitives" && <span>Same API as shadcn/ui</span>}
        <a
          href={`/r/${entry.slug}.json`}
          className="flex items-center gap-1 transition-colors hover:text-foreground"
        >
          Registry JSON
          <ArrowUpRightIcon className="size-3" />
        </a>
      </div>
    </header>
  )
}
