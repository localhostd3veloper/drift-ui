import { DialogConfirmPreview as BaseUiDialogConfirmPreview } from "@/components/preview/base/examples/dialog/confirm"
import { DialogConfirmPreview } from "@/components/preview/examples/dialog/confirm"
import { DialogControlledPreview as BaseUiDialogControlledPreview } from "@/components/preview/base/examples/dialog/controlled"
import { DialogControlledPreview } from "@/components/preview/examples/dialog/controlled"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "confirm",
    title: "Confirm an action",
    description:
      "A short dialog with a destructive button, for actions that cannot be undone.",
    Preview: DialogConfirmPreview,
    BasePreview: BaseUiDialogConfirmPreview,
  },
  {
    id: "controlled",
    title: "Controlled",
    description:
      "open and onOpenChange let your own code decide when it opens, without a DialogTrigger.",
    Preview: DialogControlledPreview,
    BasePreview: BaseUiDialogControlledPreview,
  },
]
