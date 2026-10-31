import { NumberInputControlledPreview } from "@/components/preview/examples/number-input/controlled"
import { NumberInputDecimalsPreview } from "@/components/preview/examples/number-input/decimals"
import { NumberInputFormPreview } from "@/components/preview/examples/number-input/form"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "decimals",
    title: "Decimals",
    description:
      "step sets the increment and formatOptions the display, so a CPU limit reads 0.50 rather than 0.5.",
    Preview: NumberInputDecimalsPreview,
  },
  {
    id: "controlled",
    title: "Controlled",
    description:
      "The value is a number, or null when the field is empty, so you can tell blank from zero.",
    Preview: NumberInputControlledPreview,
  },
  {
    id: "form",
    title: "Forms",
    description:
      "name submits the raw number through a hidden input, whatever the display format.",
    Preview: NumberInputFormPreview,
  },
]
