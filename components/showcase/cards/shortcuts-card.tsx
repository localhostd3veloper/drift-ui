"use client"

import * as React from "react"

import { Button } from "@/registry/default/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"
import { Label } from "@/registry/default/ui/label"
import { ShortcutRecorder } from "@/registry/default/ui/shortcut-recorder"

const ACTIONS = [
  { id: "command-menu", label: "Open command menu", shortcut: "Mod+K" },
  { id: "new-project", label: "New project", shortcut: "Mod+Shift+N" },
  { id: "toggle-sidebar", label: "Toggle sidebar", shortcut: "Mod+B" },
  { id: "search-invoices", label: "Search invoices", shortcut: "" },
]

const DEFAULT_SHORTCUTS = Object.fromEntries(
  ACTIONS.map((action) => [action.id, action.shortcut])
)

export function ShortcutsCard() {
  const [shortcuts, setShortcuts] =
    React.useState<Record<string, string>>(DEFAULT_SHORTCUTS)
  const assignedCount = Object.values(shortcuts).filter(Boolean).length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Keyboard shortcuts</CardTitle>
        <CardDescription>
          Click a shortcut, then press the new keys. Backspace clears it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col divide-y">
          {ACTIONS.map((action) => (
            <li
              key={action.id}
              className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
            >
              <Label htmlFor={`shortcut-${action.id}`} className="font-normal">
                {action.label}
              </Label>
              <ShortcutRecorder
                id={`shortcut-${action.id}`}
                value={shortcuts[action.id]}
                onValueChange={(shortcut) =>
                  setShortcuts((previous) => ({
                    ...previous,
                    [action.id]: shortcut,
                  }))
                }
                placeholder="Not set"
                className="min-w-36"
              />
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="justify-between gap-2 border-t">
        <span className="text-xs text-muted-foreground tabular-nums">
          {assignedCount} of {ACTIONS.length} assigned
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShortcuts(DEFAULT_SHORTCUTS)}
        >
          Reset defaults
        </Button>
      </CardFooter>
    </Card>
  )
}
