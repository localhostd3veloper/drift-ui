import { LabelHintPreview as BaseUiLabelHintPreview } from "@/components/preview/base/examples/label/hint"
import { LabelHintPreview } from "@/components/preview/examples/label/hint"
import { LabelRequiredPreview as BaseUiLabelRequiredPreview } from "@/components/preview/base/examples/label/required"
import { LabelRequiredPreview } from "@/components/preview/examples/label/required"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "required",
    title: "Required fields",
    description:
      "Mark the field required and hide the asterisk from screen readers, which announce required on their own.",
    Preview: LabelRequiredPreview,
    BasePreview: BaseUiLabelRequiredPreview,
  },
  {
    id: "hint",
    title: "With a hint",
    description:
      "Connect helper text with aria-describedby so it is read with the field.",
    Preview: LabelHintPreview,
    BasePreview: BaseUiLabelHintPreview,
  },
]
