import { cn } from "@/registry/default/lib/utils"
import { SectionHeading } from "@/components/landing/section-heading"
import {
  LiveDemo,
  type LiveDemoKind,
} from "@/components/landing/live/live-demo"

const ENTRIES: {
  name: string
  slug: string
  kind: LiveDemoKind
  description: string
  className: string
}[] = [
  {
    name: "Tags input",
    slug: "tags-input",
    kind: "tags",
    description:
      "Type, paste or pick. Backspace removes, arrows move between tags.",
    className: "lg:col-span-4",
  },
  {
    name: "Tree view",
    slug: "tree-view",
    kind: "tree",
    description:
      "Arrow keys, typeahead, selection and lazy children. A real tree, not a collapsible file list.",
    className: "lg:col-span-2 lg:row-span-2",
  },
  {
    name: "Stepper",
    slug: "stepper",
    kind: "stepper",
    description: "Linear or free, with per-step validation.",
    className: "lg:col-span-4",
  },
  {
    name: "Number input",
    slug: "number-input",
    kind: "number",
    description: "Min, max, step and locale formatting.",
    className: "lg:col-span-2",
  },
  {
    name: "File dropzone",
    slug: "file-dropzone",
    kind: "dropzone",
    description: "Drag and drop, previews, progress and rejection states.",
    className: "lg:col-span-2",
  },
  {
    name: "Timeline",
    slug: "timeline",
    kind: "timeline",
    description: "Activity feeds and changelogs with a current marker.",
    className: "lg:col-span-2",
  },
  {
    name: "Password input",
    slug: "password-input",
    kind: "password",
    description: "Reveal toggle and a strength meter you can configure.",
    className: "lg:col-span-2",
  },
  {
    name: "Date-time range",
    slug: "date-time-range",
    kind: "date-range",
    description:
      "Start and end times on top of the shadcn calendar, where its date picker stops at the day.",
    className: "lg:col-span-4",
  },
]

export function ComponentIndex() {
  return (
    <section
      id="components"
      className="mx-auto max-w-7xl px-4 py-20 sm:py-28 md:px-10 md:py-40"
    >
      <SectionHeading
        title={["Eight gaps", "in your ui folder"]}
        lead="Each one is a single file you own after install, with the same props conventions, cva variants and keyboard behavior as the rest of your ui folder."
      />
      <div className="mt-16 grid gap-x-4 gap-y-12 sm:grid-cols-2 md:mt-24 lg:grid-cols-6">
        {ENTRIES.map((entry, index) => (
          <figure
            key={entry.slug}
            className={cn(
              "flex min-w-0 reveal flex-col gap-5",
              entry.className
            )}
          >
            <div className="flex flex-1 items-center justify-center rounded-[1.75rem] border bg-[radial-gradient(80%_70%_at_50%_0%,color-mix(in_oklab,var(--foreground)_6%,transparent),transparent)] p-6 md:min-h-64 lg:p-10">
              <div className="w-full max-w-md">
                <LiveDemo kind={entry.kind} />
              </div>
            </div>
            <figcaption className="flex flex-col gap-1.5 px-1">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium">{entry.name}</span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  FIG 1.{index + 1}
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
