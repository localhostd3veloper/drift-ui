"use client"

import * as React from "react"

import { EmojiPicker } from "@/registry/default/ui/emoji-picker"

export function EmojiPickerPreview() {
  const [reactions, setReactions] = React.useState<string[]>([])

  return (
    <div className="flex flex-col items-center gap-3">
      <EmojiPicker
        aria-label="Add a reaction"
        onSelect={(emoji) =>
          setReactions((current) => [...current, emoji].slice(-10))
        }
      />
      <p className="h-6 text-sm text-muted-foreground">
        {reactions.length > 0 ? reactions.join(" ") : "Pick a reaction"}
      </p>
    </div>
  )
}
