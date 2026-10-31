import { AvatarSizesPreview as BaseUiAvatarSizesPreview } from "@/components/preview/base/examples/avatar/sizes"
import { AvatarSizesPreview } from "@/components/preview/examples/avatar/sizes"
import { AvatarSquarePreview as BaseUiAvatarSquarePreview } from "@/components/preview/base/examples/avatar/square"
import { AvatarSquarePreview } from "@/components/preview/examples/avatar/square"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "sizes",
    title: "Sizes",
    description: "Avatar is size-8 by default. Set any size with className.",
    Preview: AvatarSizesPreview,
    BasePreview: BaseUiAvatarSizesPreview,
  },
  {
    id: "square",
    title: "Square",
    description:
      "Override the radius on Avatar and AvatarFallback for workspace or organization logos.",
    Preview: AvatarSquarePreview,
    BasePreview: BaseUiAvatarSquarePreview,
  },
]
