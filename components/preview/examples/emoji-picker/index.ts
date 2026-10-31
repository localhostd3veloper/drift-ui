import { EmojiPickerPopoverPreview } from "@/components/preview/examples/emoji-picker/popover"
import { EmojiPickerSkinTonePreview } from "@/components/preview/examples/emoji-picker/skin-tone"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "popover",
    title: "In a popover",
    description:
      "EmojiPicker is an inline panel, so put it in a Popover for a reaction button. It loads its data the first time it opens.",
    Preview: EmojiPickerPopoverPreview,
  },
  {
    id: "skin-tone",
    title: "Skin tone",
    description:
      "Store the tone yourself with skinTone and onSkinToneChange to sync it with a user profile. Otherwise it persists in localStorage.",
    Preview: EmojiPickerSkinTonePreview,
  },
]
