import { CircleDotIcon, HashIcon, TextIcon } from "lucide-react"

import type { FilterField } from "@/registry/default/lib/filter"
import { ColorPicker } from "@/registry/default/ui/color-picker"
import { FilterBuilder } from "@/registry/default/ui/filter-builder"
import { MentionTextarea } from "@/registry/default/ui/mention-textarea"
import { ShortcutRecorder } from "@/registry/default/ui/shortcut-recorder"
import { TimeField } from "@/registry/default/ui/time-field"
import { BulkActionDemo } from "@/components/landing/more/bulk-action-demo"
import { InlineEditDemo } from "@/components/landing/more/inline-edit-demo"
import { TourDemo } from "@/components/landing/more/tour-demo"

export type WorkflowDemoKind =
  | "filter"
  | "shortcut"
  | "bulk"
  | "color"
  | "mention"
  | "time"
  | "inline-edit"
  | "tour"

const FILTER_FIELDS: FilterField[] = [
  {
    id: "status",
    label: "Status",
    type: "select",
    icon: <CircleDotIcon />,
    options: [
      { value: "open", label: "Open" },
      { value: "closed", label: "Closed" },
    ],
  },
  { id: "title", label: "Title", type: "text", icon: <TextIcon /> },
  { id: "points", label: "Points", type: "number", icon: <HashIcon /> },
]

const MENTION_TRIGGERS = {
  "@": [
    { value: "noor", label: "Noor Haddad", description: "Platform" },
    { value: "kofi", label: "Kofi Mensah", description: "Design" },
    { value: "ilse", label: "Ilse Marchetti", description: "Support" },
  ],
  "#": [
    { value: "incidents", label: "incidents" },
    { value: "releases", label: "releases" },
  ],
}

export function WorkflowDemo({ kind }: { kind: WorkflowDemoKind }) {
  switch (kind) {
    case "filter":
      return (
        <FilterBuilder
          aria-label="Issue filters"
          fields={FILTER_FIELDS}
          defaultValue={[
            {
              id: "status-open",
              fieldId: "status",
              operator: "is",
              value: "open",
            },
          ]}
        />
      )
    case "shortcut":
      return (
        <ShortcutRecorder
          aria-label="Open command menu"
          defaultValue="Mod+K"
          className="w-full"
        />
      )
    case "bulk":
      return <BulkActionDemo />
    case "color":
      return (
        <ColorPicker
          aria-label="Accent color"
          defaultValue="#2f6fd8"
          className="w-full"
        />
      )
    case "mention":
      return (
        <MentionTextarea
          aria-label="Comment"
          defaultValue="Ship it once @"
          placeholder="Type @ or #"
          triggers={MENTION_TRIGGERS}
        />
      )
    case "time":
      return (
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <TimeField
            aria-label="Start"
            defaultValue="09:30"
            minuteStep={15}
            hourCycle={12}
          />
          to
          <TimeField aria-label="End" defaultValue="17:45" hourCycle={12} />
        </div>
      )
    case "inline-edit":
      return <InlineEditDemo />
    case "tour":
      return <TourDemo />
  }
}
