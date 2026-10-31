import { RatingDisabledPreview } from "@/components/preview/examples/rating/disabled"
import { RatingMaxPreview } from "@/components/preview/examples/rating/max"
import { RatingReadOnlyPreview } from "@/components/preview/examples/rating/read-only"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "max",
    title: "Longer scales",
    description: "max sets the number of icons.",
    Preview: RatingMaxPreview,
  },
  {
    id: "read-only",
    title: "Read only",
    description:
      "readOnly drops the radios and exposes one image named like 4.5 out of 5, for averages on a product card.",
    Preview: RatingReadOnlyPreview,
  },
  {
    id: "disabled",
    title: "Disabled",
    description: "disabled dims the rating and removes it from the tab order.",
    Preview: RatingDisabledPreview,
  },
]
