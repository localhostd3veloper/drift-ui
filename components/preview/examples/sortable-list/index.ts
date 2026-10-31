import { SortableListControlledPreview } from "@/components/preview/examples/sortable-list/controlled"
import { SortableListHorizontalPreview } from "@/components/preview/examples/sortable-list/horizontal"
import { SortableListLockedItemPreview } from "@/components/preview/examples/sortable-list/locked-item"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "horizontal",
    title: "Horizontal",
    description:
      'orientation="horizontal" lays items out in a row and moves them with the left and right arrow keys.',
    Preview: SortableListHorizontalPreview,
  },
  {
    id: "controlled",
    title: "Save the order",
    description:
      "onValueChange fires once on drop, and only if the order changed, so it is the place to call your API.",
    Preview: SortableListControlledPreview,
  },
  {
    id: "locked-item",
    title: "Locked items",
    description:
      "disabled on a SortableItem keeps that row from moving, while the others can still be reordered.",
    Preview: SortableListLockedItemPreview,
  },
]
