import { AvatarGroupNoLimitPreview } from "@/components/preview/examples/avatar-group/no-limit"
import { AvatarGroupStatusPreview } from "@/components/preview/examples/avatar-group/status"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "no-limit",
    title: "No limit",
    description:
      "Leave out max to show every avatar, for small teams where the +N button is not needed.",
    Preview: AvatarGroupNoLimitPreview,
  },
  {
    id: "status",
    title: "Presence",
    description:
      "status adds a dot and reads the state aloud, for who is viewing a document right now.",
    Preview: AvatarGroupStatusPreview,
  },
]
