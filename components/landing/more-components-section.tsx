import Link from "next/link"

import { cn } from "@/registry/default/lib/utils"
import { DemoCard } from "@/components/landing/demo-card"
import { SectionHeading } from "@/components/landing/section-heading"
import {
  WorkflowDemo,
  type WorkflowDemoKind,
} from "@/components/landing/more/workflow-demo"

type Surface = "brand" | "dots" | "muted"

const SURFACE: Record<Surface, string> = {
  brand:
    "bg-[radial-gradient(90%_80%_at_0%_0%,color-mix(in_oklab,var(--brand)_16%,transparent),transparent)] bg-brand/[0.03]",
  dots: "bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-[size:16px_16px]",
  muted: "bg-muted/50",
}

const ENTRIES: {
  name: string
  slug: string
  kind: WorkflowDemoKind
  description: string
  className: string
  surface?: Surface
}[] = [
  {
    name: "Filter builder",
    slug: "filter-builder",
    kind: "filter",
    description:
      "Field, operator and value as chips, plus a matchesFilter helper for your rows.",
    className: "md:col-span-4",
    surface: "brand",
  },
  {
    name: "Shortcut recorder",
    slug: "shortcut-recorder",
    kind: "shortcut",
    description: "Press a combination, get ⌘K on a Mac and Ctrl K elsewhere.",
    className: "md:col-span-2",
  },
  {
    name: "Bulk action bar",
    slug: "bulk-action-bar",
    kind: "bulk",
    description:
      "Appears with the selection, arrow keys between actions, Escape clears.",
    className: "md:col-span-3",
  },
  {
    name: "Color picker",
    slug: "color-picker",
    kind: "color",
    description:
      "Area, hue, alpha and eyedropper, with the oklch value your theme uses.",
    className: "md:col-span-3",
    surface: "dots",
  },
  {
    name: "Mention textarea",
    slug: "mention-textarea",
    kind: "mention",
    description:
      "People after @, channels after #, any list after any trigger.",
    className: "md:col-span-4",
  },
  {
    name: "Time field",
    slug: "time-field",
    kind: "time",
    description: "Segmented spinbuttons with typeahead, in 12 or 24 hour time.",
    className: "md:col-span-2",
    surface: "muted",
  },
  {
    name: "Inline edit",
    slug: "inline-edit",
    kind: "inline-edit",
    description:
      "Click to edit. Enter saves, Escape cancels, async saves wait.",
    className: "md:col-span-3",
  },
  {
    name: "Tour",
    slug: "tour",
    kind: "tour",
    description: "Spotlights real elements and follows them as the page moves.",
    className: "md:col-span-3",
    surface: "brand",
  },
]

export function MoreComponentsSection() {
  return (
    <section
      id="workflow"
      className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:py-28 md:px-10 md:py-36"
    >
      <SectionHeading
        title="Eight more, and these ones work"
        lead="Filters, tours, bulk actions and the inputs settings screens keep asking for. Every demo below is the real component, so go ahead and use it."
      />
      <div className="mt-14 grid gap-4 md:mt-20 md:grid-cols-6">
        {ENTRIES.map((entry) => (
          <figure
            key={entry.slug}
            className={cn(
              "flex reveal flex-col overflow-hidden rounded-2xl border",
              entry.surface && SURFACE[entry.surface],
              entry.className
            )}
          >
            <div className="flex flex-1 items-center justify-center p-5 md:min-h-64 md:p-8">
              <DemoCard className="w-full max-w-md">
                <WorkflowDemo kind={entry.kind} />
              </DemoCard>
            </div>
            <figcaption className="flex flex-col gap-1 px-5 pb-5 md:px-8 md:pb-7">
              <Link
                href={`/components/${entry.slug}`}
                className="w-fit font-medium transition-colors hover:text-brand"
              >
                {entry.name}
              </Link>
              <p className="max-w-[48ch] text-sm text-muted-foreground">
                {entry.description}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
