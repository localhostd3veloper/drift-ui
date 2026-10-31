import { InlineEditDisabledPreview } from "@/components/preview/examples/inline-edit/disabled"
import { InlineEditValidationPreview } from "@/components/preview/examples/inline-edit/validation"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "validation",
    title: "Validation",
    description:
      "Throw from onSave to reject the edit. The field is marked invalid and stays open with the text you typed.",
    Preview: InlineEditValidationPreview,
  },
  {
    id: "disabled",
    title: "Disabled",
    description:
      "disabled shows the value without opening the editor, for people who can read but not change it.",
    Preview: InlineEditDisabledPreview,
  },
]
