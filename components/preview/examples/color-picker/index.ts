import { ColorPickerControlledPreview } from "@/components/preview/examples/color-picker/controlled"
import { ColorPickerNoAlphaPreview } from "@/components/preview/examples/color-picker/no-alpha"
import { ColorPickerTriggerPreview } from "@/components/preview/examples/color-picker/trigger"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "no-alpha",
    title: "Without opacity",
    description:
      "showAlpha={false} removes the opacity slider, so the value stays a six digit hex color.",
    Preview: ColorPickerNoAlphaPreview,
  },
  {
    id: "controlled",
    title: "Controlled",
    description:
      "Keep the hex in state with value and onValueChange to drive other parts of the screen.",
    Preview: ColorPickerControlledPreview,
  },
  {
    id: "trigger",
    title: "Trigger style",
    description:
      "variant and size take the same values as Button and style the trigger.",
    Preview: ColorPickerTriggerPreview,
  },
]
