import { ShortcutCheatsheetRecordedPreview } from "@/components/preview/examples/shortcut-cheatsheet/recorded"
import { ShortcutCheatsheetTriggerPreview } from "@/components/preview/examples/shortcut-cheatsheet/trigger"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "recorded",
    title: "Customised bindings",
    description:
      "Pass the values from a ShortcutRecorder into sections and the cheatsheet shows what the user actually bound.",
    Preview: ShortcutCheatsheetRecordedPreview,
  },
  {
    id: "trigger",
    title: "Another trigger",
    description:
      'trigger takes a recorded shortcut as well as a character, such as "Mod+/". Set it to an empty string to open the cheatsheet only from your own controls.',
    Preview: ShortcutCheatsheetTriggerPreview,
  },
]
