import { TimeFieldControlledPreview } from "@/components/preview/examples/time-field/controlled"
import { TimeFieldDisabledPreview } from "@/components/preview/examples/time-field/disabled"
import { TimeFieldFormPreview } from "@/components/preview/examples/time-field/form"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "controlled",
    title: "Controlled",
    description:
      "The value is always 24 hour HH:mm, even with hourCycle={12}, and an empty string when cleared.",
    Preview: TimeFieldControlledPreview,
  },
  {
    id: "form",
    title: "Forms",
    description: "name submits the value through a hidden input.",
    Preview: TimeFieldFormPreview,
  },
  {
    id: "disabled",
    title: "Disabled",
    description: "disabled locks every segment.",
    Preview: TimeFieldDisabledPreview,
  },
]
