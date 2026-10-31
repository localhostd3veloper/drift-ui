"use client"

import * as React from "react"
import { SmilePlusIcon } from "lucide-react"

import { buttonVariants } from "@/registry/default/ui/button"
import { EmojiPicker } from "@/registry/default/ui/emoji-picker"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover"

export function EmojiPickerPopoverPreview() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [reaction, setReaction] = React.useState("")

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        aria-label="Add a reaction"
        className={buttonVariants({ variant: "outline" })}
      >
        {reaction || <SmilePlusIcon />}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <EmojiPicker
          aria-label="Add a reaction"
          onSelect={(emoji) => {
            setReaction(emoji)
            setIsOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
