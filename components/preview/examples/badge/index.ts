import { BadgeAsLinkPreview as BaseUiBadgeAsLinkPreview } from "@/components/preview/base/examples/badge/as-link"
import { BadgeAsLinkPreview } from "@/components/preview/examples/badge/as-link"
import { BadgeWithIconPreview as BaseUiBadgeWithIconPreview } from "@/components/preview/base/examples/badge/with-icon"
import { BadgeWithIconPreview } from "@/components/preview/examples/badge/with-icon"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "with-icon",
    title: "With an icon",
    description: "Put a lucide icon beside the text and Badge sizes it.",
    Preview: BadgeWithIconPreview,
    BasePreview: BaseUiBadgeWithIconPreview,
  },
  {
    id: "as-link",
    title: "As a link",
    description:
      "asChild passes the badge styles to your own link. In Base UI the same thing is the render prop.",
    Preview: BadgeAsLinkPreview,
    BasePreview: BaseUiBadgeAsLinkPreview,
  },
]
