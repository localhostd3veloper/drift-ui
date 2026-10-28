import {
  ComponentIndexTabs,
  type IndexEntry,
} from "@/components/landing/component-index-tabs"
import { SectionHeading } from "@/components/landing/section-heading"

const ENTRIES: IndexEntry[] = [
  {
    name: "Tags input",
    slug: "tags-input",
    kind: "tags",
    description:
      "Type, paste or pick. Backspace removes, arrows move between tags.",
  },
  {
    name: "Tree view",
    slug: "tree-view",
    kind: "tree",
    description:
      "Arrow keys, typeahead, selection and lazy children. A real tree, not a collapsible file list.",
  },
  {
    name: "Stepper",
    slug: "stepper",
    kind: "stepper",
    description: "Linear or free, with per-step validation.",
  },
  {
    name: "Number input",
    slug: "number-input",
    kind: "number",
    description: "Min, max, step and locale formatting.",
  },
  {
    name: "File dropzone",
    slug: "file-dropzone",
    kind: "dropzone",
    description: "Drag and drop, previews, progress and rejection states.",
  },
  {
    name: "Timeline",
    slug: "timeline",
    kind: "timeline",
    description: "Activity feeds and changelogs with a current marker.",
  },
  {
    name: "Password input",
    slug: "password-input",
    kind: "password",
    description: "Reveal toggle and a strength meter you can configure.",
  },
  {
    name: "Date-time range",
    slug: "date-time-range",
    kind: "date-range",
    description:
      "Start and end times on top of the shadcn calendar, where its date picker stops at the day.",
  },
]

export function ComponentIndex() {
  return (
    <section
      id="components"
      className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 md:px-10 md:py-36"
    >
      <SectionHeading
        title="Eight gaps in your ui folder"
        lead="Each one is a single file you own after install, with the same props conventions, cva variants and keyboard behavior as the rest of your ui folder."
      />
      <div className="mt-14 reveal md:mt-20">
        <ComponentIndexTabs entries={ENTRIES} />
      </div>
    </section>
  )
}
