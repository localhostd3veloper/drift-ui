"use client"

import * as React from "react"

import { matchesShortcut } from "@/registry/default/lib/shortcut"
import { Label } from "@/registry/default/ui/label"
import { ShortcutRecorder } from "@/registry/default/ui/shortcut-recorder"

export function ShortcutRecorderListenPreview() {
  const [shortcut, setShortcut] = React.useState("Mod+Shift+L")
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    const isMac = navigator.platform.startsWith("Mac")

    function handleKeyDown(event: KeyboardEvent) {
      if (!matchesShortcut(event, shortcut, isMac)) return

      event.preventDefault()
      setCount((current) => current + 1)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [shortcut])

  return (
    <div className="flex flex-col gap-2">
      <Label>Log an entry</Label>
      <ShortcutRecorder
        aria-label="Log an entry"
        value={shortcut}
        onValueChange={setShortcut}
      />
      <p className="text-sm text-muted-foreground">Pressed {count} times</p>
    </div>
  )
}
