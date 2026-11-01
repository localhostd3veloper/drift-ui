"use client"

import * as React from "react"

import { Button } from "@/registry/default/ui/button"
import { Label } from "@/registry/default/ui/label"
import { ShortcutCheatsheet } from "@/registry/default/ui/shortcut-cheatsheet"
import { ShortcutRecorder } from "@/registry/default/ui/shortcut-recorder"

export function ShortcutCheatsheetRecordedPreview() {
  const [keys, setKeys] = React.useState("Mod+K")
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex flex-col gap-2">
        <Label>Search</Label>
        <ShortcutRecorder
          aria-label="Search"
          value={keys}
          onValueChange={setKeys}
        />
      </div>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Show shortcuts
      </Button>
      <ShortcutCheatsheet
        trigger=""
        open={open}
        onOpenChange={setOpen}
        sections={[
          {
            title: "Navigation",
            shortcuts: [{ keys, label: "Search" }],
          },
        ]}
      />
    </div>
  )
}
