import { TransferListDisabledPreview } from "@/components/preview/examples/transfer-list/disabled"
import { TransferListNoSelectAllPreview } from "@/components/preview/examples/transfer-list/no-select-all"
import { TransferListRenderItemPreview } from "@/components/preview/examples/transfer-list/render-item"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "render-item",
    title: "Custom rows",
    description:
      "renderItem replaces the row's content, here adding a role badge beside the name.",
    Preview: TransferListRenderItemPreview,
  },
  {
    id: "no-select-all",
    title: "Without select all",
    description:
      "showSelectAll={false} removes the header checkboxes, for lists where moving everything at once is a mistake.",
    Preview: TransferListNoSelectAllPreview,
  },
  {
    id: "disabled",
    title: "Disabled",
    description:
      "disabled locks both panels and the move buttons, for people who can see the setting but not change it.",
    Preview: TransferListDisabledPreview,
  },
]
