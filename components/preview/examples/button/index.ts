import { ButtonAsLinkPreview as BaseUiButtonAsLinkPreview } from "@/components/preview/base/examples/button/as-link"
import { ButtonAsLinkPreview } from "@/components/preview/examples/button/as-link"
import { ButtonLoadingPreview as BaseUiButtonLoadingPreview } from "@/components/preview/base/examples/button/loading"
import { ButtonLoadingPreview } from "@/components/preview/examples/button/loading"
import { ButtonSizesPreview as BaseUiButtonSizesPreview } from "@/components/preview/base/examples/button/sizes"
import { ButtonSizesPreview } from "@/components/preview/examples/button/sizes"
import { ButtonWithIconPreview as BaseUiButtonWithIconPreview } from "@/components/preview/base/examples/button/with-icon"
import { ButtonWithIconPreview } from "@/components/preview/examples/button/with-icon"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "with-icon",
    title: "With an icon",
    description:
      "Add a lucide icon as a child. The gap and icon size come from Button.",
    Preview: ButtonWithIconPreview,
    BasePreview: BaseUiButtonWithIconPreview,
  },
  {
    id: "sizes",
    title: "Sizes",
    description:
      "size takes sm, default, lg or icon. Give icon buttons an aria-label.",
    Preview: ButtonSizesPreview,
    BasePreview: BaseUiButtonSizesPreview,
  },
  {
    id: "loading",
    title: "Loading",
    description:
      "There is no loading prop. Disable the button and swap in a spinner while the work runs.",
    Preview: ButtonLoadingPreview,
    BasePreview: BaseUiButtonLoadingPreview,
  },
  {
    id: "as-link",
    title: "As a link",
    description:
      "asChild passes the button styles to your own link, so navigation stays an anchor. In Base UI the same thing is the render prop with nativeButton={false}.",
    Preview: ButtonAsLinkPreview,
    BasePreview: BaseUiButtonAsLinkPreview,
  },
]
