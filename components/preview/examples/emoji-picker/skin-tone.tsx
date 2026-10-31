"use client"

import * as React from "react"

import { EmojiPicker } from "@/registry/default/ui/emoji-picker"

const TONE_NAMES = [
  "Default",
  "Light",
  "Medium light",
  "Medium",
  "Medium dark",
  "Dark",
]

export function EmojiPickerSkinTonePreview() {
  const [tone, setTone] = React.useState<0 | 1 | 2 | 3 | 4 | 5>(3)

  return (
    <div className="flex flex-col items-center gap-3">
      <EmojiPicker
        aria-label="Pick an emoji"
        skinTone={tone}
        onSkinToneChange={setTone}
      />
      <p className="text-sm text-muted-foreground">
        Saved tone: {TONE_NAMES[tone]}
      </p>
    </div>
  )
}
