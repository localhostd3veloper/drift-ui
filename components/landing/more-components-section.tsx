import { cn } from "@/registry/default/lib/utils"
import { DemoCard } from "@/components/landing/demo-card"
import { SectionHeading } from "@/components/landing/section-heading"
import {
  WorkflowDemo,
  type WorkflowDemoKind,
} from "@/components/landing/more/workflow-demo"

const ENTRIES: {
  name: string
  slug: string
  kind: WorkflowDemoKind
  description: string
  className: string
}[] = [
  {
    name: "Filter builder",
    slug: "filter-builder",
    kind: "filter",
    description:
      "Field, operator and value as chips, plus a matchesFilter helper for your rows.",
    className: "md:col-span-4",
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
  },
]

export function MoreComponentsSection() {
  return (
    <section
      id="workflow"
      className="mx-auto max-w-7xl scroll-mt-24 px-4 py-28 md:px-10 md:py-40"
    >
      <SectionHeading
        eyebrow="New"
        title={["Eight more,", "and these ones work"]}
        lead="Filters, tours, bulk actions and the inputs settings screens keep asking for. Every demo below is the real component, so go ahead and use it."
      />
      <div className="mt-16 grid gap-x-4 gap-y-12 md:mt-24 md:grid-cols-6">
        {ENTRIES.map((entry, index) => (
          <figure
            key={entry.slug}
            className={cn("flex reveal flex-col gap-5", entry.className)}
          >
            <div className="flex flex-1 items-center justify-center rounded-[1.75rem] border bg-[radial-gradient(80%_70%_at_50%_0%,color-mix(in_oklab,var(--foreground)_6%,transparent),transparent)] p-6 md:min-h-64 md:p-10">
              <DemoCard className="w-full max-w-md">
                <WorkflowDemo kind={entry.kind} />
              </DemoCard>
            </div>
            <figcaption className="flex flex-col gap-1.5 px-1">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium">{entry.name}</span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  FIG 2.{index + 1}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {entry.description}
              </p>
              <code className="font-mono text-xs text-muted-foreground/70">
                @drift-ui/{entry.slug}
              </code>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
