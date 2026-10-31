import { InputFilePreview } from "@/components/preview/examples/input/file"
import { InputWithButtonPreview } from "@/components/preview/examples/input/with-button"
import { InputWithIconPreview } from "@/components/preview/examples/input/with-icon"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "with-button",
    title: "With a button",
    description:
      "Input fills its container, so a flex row pairs it with a button.",
    Preview: InputWithButtonPreview,
  },
  {
    id: "with-icon",
    title: "With an icon",
    description:
      "Position the icon inside a relative wrapper and pad the input to make room.",
    Preview: InputWithIconPreview,
  },
  {
    id: "file",
    title: "File",
    description:
      'type="file" keeps the native picker, styled to match the other fields.',
    Preview: InputFilePreview,
  },
]
