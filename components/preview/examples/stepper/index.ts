import { StepperCustomControlsPreview as BaseUiStepperCustomControlsPreview } from "@/components/preview/base/examples/stepper/custom-controls"
import { StepperCustomControlsPreview } from "@/components/preview/examples/stepper/custom-controls"
import { StepperFreeNavigationPreview as BaseUiStepperFreeNavigationPreview } from "@/components/preview/base/examples/stepper/free-navigation"
import { StepperFreeNavigationPreview } from "@/components/preview/examples/stepper/free-navigation"
import { StepperVerticalPreview as BaseUiStepperVerticalPreview } from "@/components/preview/base/examples/stepper/vertical"
import { StepperVerticalPreview } from "@/components/preview/examples/stepper/vertical"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "vertical",
    title: "Vertical",
    description:
      'orientation="vertical" stacks the steps, which leaves room for longer titles and fits a sidebar.',
    Preview: StepperVerticalPreview,
    BasePreview: BaseUiStepperVerticalPreview,
  },
  {
    id: "free-navigation",
    title: "Free navigation",
    description:
      "Without linear, every step stays clickable, for settings people can fill in any order.",
    Preview: StepperFreeNavigationPreview,
    BasePreview: BaseUiStepperFreeNavigationPreview,
  },
  {
    id: "custom-controls",
    title: "Custom controls",
    description:
      "useStepper reads and sets the step from any component inside Stepper, for a progress label or a jump back to the start.",
    Preview: StepperCustomControlsPreview,
    BasePreview: BaseUiStepperCustomControlsPreview,
  },
]
