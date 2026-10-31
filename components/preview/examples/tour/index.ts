import { TourControlledStepPreview as BaseUiTourControlledStepPreview } from "@/components/preview/base/examples/tour/controlled-step"
import { TourControlledStepPreview } from "@/components/preview/examples/tour/controlled-step"
import { TourOnCompletePreview as BaseUiTourOnCompletePreview } from "@/components/preview/base/examples/tour/on-complete"
import { TourOnCompletePreview } from "@/components/preview/examples/tour/on-complete"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "on-complete",
    title: "Remember completion",
    description:
      "onComplete runs after Finish on the last step, so you can record that someone has seen the tour.",
    Preview: TourOnCompletePreview,
    BasePreview: BaseUiTourOnCompletePreview,
  },
  {
    id: "controlled-step",
    title: "Controlled step",
    description:
      "step and onStepChange tell you where someone is, for analytics or to change the page as the tour moves.",
    Preview: TourControlledStepPreview,
    BasePreview: BaseUiTourControlledStepPreview,
  },
]
