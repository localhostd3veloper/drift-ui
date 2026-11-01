"use client"

import * as React from "react"

import { Button } from "@/registry/default/ui/button"
import { ShortcutCheatsheet } from "@/registry/default/ui/shortcut-cheatsheet"
import { ShortcutKeys } from "@/registry/default/ui/shortcut-recorder"

const SECTIONS = [
  {
    title: "Navigation",
    shortcuts: [
      { keys: "Mod+K", label: "Search" },
      { keys: "G", label: "Go to inbox" },
      { keys: "Mod+ArrowUp", label: "Previous thread" },
      { keys: "Mod+ArrowDown", label: "Next thread" },
    ],
  },
  {
    title: "Editing",
    shortcuts: [
      { keys: "Mod+Enter", label: "Send" },
      { keys: "Mod+Shift+K", label: "Insert link" },
      { keys: "Mod+Backspace", label: "Delete draft" },
    ],
  },
]

export function ShortcutCheatsheetPreview() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Keyboard shortcuts
      </Button>
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        Or press <ShortcutKeys shortcut="?" />
      </p>
      <ShortcutCheatsheet
        sections={SECTIONS}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  )
}
