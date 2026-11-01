import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { CATALOG, CATEGORIES } from "@/lib/catalog"
import { SectionHeading } from "@/components/landing/section-heading"

const NAMES_PER_CATEGORY = 6

const ROWS = CATEGORIES.map((category) => {
  const entries = CATALOG.filter((entry) => entry.category === category.id)

  return {
    ...category,
    total: entries.length,
    named: entries.slice(0, NAMES_PER_CATEGORY),
    remaining: Math.max(entries.length - NAMES_PER_CATEGORY, 0),
  }
})

export function CatalogBand() {
  return (
    <section
      id="catalog"
      className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 md:px-10 md:py-36"
    >
      <SectionHeading
        title="Every component is source you own"
        lead="Install one at a time with the shadcn CLI. Each comes with the same props conventions, cva variants and keyboard behavior as the rest of your ui folder."
      />
      <dl className="mt-14 border-b md:mt-20">
        {ROWS.map((row) => (
          <div
            key={row.id}
            className="grid reveal gap-x-10 gap-y-4 border-t py-8 md:py-10 lg:grid-cols-12"
          >
            <dt className="flex flex-col gap-2 lg:col-span-4">
              <span className="flex items-baseline gap-3 font-display text-2xl font-semibold tracking-tight">
                {row.label}
                <span className="font-mono text-xs font-normal tracking-normal text-muted-foreground tabular-nums">
                  {row.total}
                </span>
              </span>
              <span className="max-w-[34ch] text-sm leading-relaxed text-muted-foreground">
                {row.description}
              </span>
            </dt>
            <dd className="lg:col-span-8">
              <ul className="flex flex-wrap items-baseline gap-x-[0.7em] gap-y-[0.2em] font-display text-[clamp(1.25rem,2.1vw,1.875rem)] leading-[1.25] font-medium tracking-[-0.025em]">
                {row.named.map((entry) => (
                  <li key={entry.slug}>
                    <Link
                      href={`/components/${entry.slug}`}
                      className="rounded-sm text-foreground/70 transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    >
                      {entry.name}
                    </Link>
                  </li>
                ))}
                {row.remaining > 0 && (
                  <li>
                    <Link
                      href="/components"
                      prefetch={false}
                      className="rounded-sm text-brand transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    >
                      and {row.remaining} more
                    </Link>
                  </li>
                )}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
      <Link
        href="/components"
        prefetch={false}
        className="group mt-8 flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Browse all components
        <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </section>
  )
}
