import { TimelineCompactPreview } from "@/components/preview/examples/timeline/compact"
import { TimelineRichContentPreview } from "@/components/preview/examples/timeline/rich-content"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "compact",
    title: "Compact",
    description:
      "TimelineDescription is optional, so a title and time make a dense activity log.",
    Preview: TimelineCompactPreview,
  },
  {
    id: "rich-content",
    title: "Rich content",
    description:
      "TimelineContent takes any children, so an entry can hold badges, links or a quoted comment.",
    Preview: TimelineRichContentPreview,
  },
]
