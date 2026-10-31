import { BulkActionBarSelectAllPreview as BaseUiBulkActionBarSelectAllPreview } from "@/components/preview/base/examples/bulk-action-bar/select-all"
import { BulkActionBarSelectAllPreview } from "@/components/preview/examples/bulk-action-bar/select-all"
import { BulkActionBarViewportPreview as BaseUiBulkActionBarViewportPreview } from "@/components/preview/base/examples/bulk-action-bar/viewport"
import { BulkActionBarViewportPreview } from "@/components/preview/examples/bulk-action-bar/viewport"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "viewport",
    title: "Fixed to the screen",
    description:
      "The default placement portals the bar to the bottom of the viewport, so it stays in reach on a long table. Tick a row to see it.",
    Preview: BulkActionBarViewportPreview,
    BasePreview: BaseUiBulkActionBarViewportPreview,
  },
  {
    id: "select-all",
    title: "Select all",
    description:
      "selectedCount can come from anywhere. A header checkbox with an indeterminate state covers selecting every row at once.",
    Preview: BulkActionBarSelectAllPreview,
    BasePreview: BaseUiBulkActionBarSelectAllPreview,
  },
]
