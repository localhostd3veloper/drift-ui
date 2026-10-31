import { MultiSelectControlledPreview as BaseUiMultiSelectControlledPreview } from "@/components/preview/base/examples/multi-select/controlled"
import { MultiSelectControlledPreview } from "@/components/preview/examples/multi-select/controlled"
import { MultiSelectMaxSelectedPreview as BaseUiMultiSelectMaxSelectedPreview } from "@/components/preview/base/examples/multi-select/max-selected"
import { MultiSelectMaxSelectedPreview } from "@/components/preview/examples/multi-select/max-selected"
import { MultiSelectVisibleChipsPreview as BaseUiMultiSelectVisibleChipsPreview } from "@/components/preview/base/examples/multi-select/visible-chips"
import { MultiSelectVisibleChipsPreview } from "@/components/preview/examples/multi-select/visible-chips"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "max-selected",
    title: "Selection limit",
    description:
      "maxSelected disables the remaining options once the limit is reached and hides Select all.",
    Preview: MultiSelectMaxSelectedPreview,
    BasePreview: BaseUiMultiSelectMaxSelectedPreview,
  },
  {
    id: "controlled",
    title: "Controlled",
    description:
      "value holds the selected option values, ready to send to your API.",
    Preview: MultiSelectControlledPreview,
    BasePreview: BaseUiMultiSelectControlledPreview,
  },
  {
    id: "visible-chips",
    title: "Collapse long selections",
    description:
      "maxVisibleChips keeps the field on one line and rolls the rest into a +N count.",
    Preview: MultiSelectVisibleChipsPreview,
    BasePreview: BaseUiMultiSelectVisibleChipsPreview,
  },
]
