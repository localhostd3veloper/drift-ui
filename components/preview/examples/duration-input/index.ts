import { DurationInputFormPreview } from "@/components/preview/examples/duration-input/form"
import { DurationInputLimitsPreview } from "@/components/preview/examples/duration-input/limits"
import { DurationInputUnitsPreview } from "@/components/preview/examples/duration-input/units"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "units",
    title: "Choose the units",
    description:
      "units sets which segments appear. Values stay in milliseconds whichever you pick.",
    Preview: DurationInputUnitsPreview,
  },
  {
    id: "limits",
    title: "Limits and steps",
    description:
      "min and max clamp the total in milliseconds, and step sets how far arrow keys move a segment.",
    Preview: DurationInputLimitsPreview,
  },
  {
    id: "form",
    title: "Forms",
    description: "name submits the milliseconds through a hidden input.",
    Preview: DurationInputFormPreview,
  },
]
