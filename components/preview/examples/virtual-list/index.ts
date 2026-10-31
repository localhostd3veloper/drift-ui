import { VirtualListAppendPreview } from "@/components/preview/examples/virtual-list/append"
import { VirtualListFocusableRowsPreview } from "@/components/preview/examples/virtual-list/focusable-rows"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "append",
    title: "Growing lists",
    description:
      "Give rows a stable getItemKey so measured heights and focus follow them when items are added, as in a live log.",
    Preview: VirtualListAppendPreview,
  },
  {
    id: "focusable-rows",
    title: "Focusable rows",
    description:
      "Rows can hold buttons and links. The focused row stays mounted while it is scrolled away, so keyboard focus is not lost.",
    Preview: VirtualListFocusableRowsPreview,
  },
]
