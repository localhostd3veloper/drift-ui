import { PopoverHelpPreview as BaseUiPopoverHelpPreview } from "@/components/preview/base/examples/popover/help"
import { PopoverHelpPreview } from "@/components/preview/examples/popover/help"
import { PopoverPlacementPreview as BaseUiPopoverPlacementPreview } from "@/components/preview/base/examples/popover/placement"
import { PopoverPlacementPreview } from "@/components/preview/examples/popover/placement"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "placement",
    title: "Placement",
    description:
      "side and align on PopoverContent position it around the trigger. It flips when there is no room.",
    Preview: PopoverPlacementPreview,
    BasePreview: BaseUiPopoverPlacementPreview,
  },
  {
    id: "help",
    title: "Inline help",
    description:
      "A small icon trigger next to a label keeps long explanations off the form until someone asks.",
    Preview: PopoverHelpPreview,
    BasePreview: BaseUiPopoverHelpPreview,
  },
]
