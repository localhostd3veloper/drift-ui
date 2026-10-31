import { ShortcutRecorderKeysPreview } from "@/components/preview/examples/shortcut-recorder/keys"
import { ShortcutRecorderListenPreview } from "@/components/preview/examples/shortcut-recorder/listen"
import { ShortcutRecorderSingleKeysPreview } from "@/components/preview/examples/shortcut-recorder/single-keys"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "single-keys",
    title: "Keys without a modifier",
    description:
      "requireModifier={false} accepts a bare key, for shortcuts like J and K in a list.",
    Preview: ShortcutRecorderSingleKeysPreview,
  },
  {
    id: "listen",
    title: "Respond to a shortcut",
    description:
      "matchesShortcut checks a keyboard event against a stored shortcut, so the value you record is the one you listen for.",
    Preview: ShortcutRecorderListenPreview,
  },
  {
    id: "keys",
    title: "Show shortcuts",
    description:
      "ShortcutKeys renders a stored value as kbd elements with the right symbols for the platform, for menus and help screens.",
    Preview: ShortcutRecorderKeysPreview,
  },
]
