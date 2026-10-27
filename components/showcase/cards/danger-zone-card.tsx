"use client"

import * as React from "react"

import { Button } from "@/registry/default/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/default/ui/dialog"
import { Input } from "@/registry/default/ui/input"
import { Label } from "@/registry/default/ui/label"

const PROJECT_NAME = "ledgerline-api"

const ACTIONS = {
  archive: {
    label: "Archive project",
    button: "Archive",
    detail: "Read only. Deploys stop and you can restore it any time.",
    title: "Archive this project?",
    description: "Deploys and webhooks pause until someone restores it.",
    confirm: "Archive",
  },
  delete: {
    label: "Delete project",
    button: "Delete",
    detail: "Removes deploys, env vars and logs. This cannot be undone.",
    title: "Delete this project?",
    description: "All deploys, environment variables and logs are erased.",
    confirm: "Delete forever",
  },
} as const

type Action = keyof typeof ACTIONS

export function DangerZoneCard() {
  const [action, setAction] = React.useState<Action | null>(null)
  const [confirmText, setConfirmText] = React.useState("")
  const isConfirmed = confirmText === PROJECT_NAME
  const current = action ? ACTIONS[action] : null

  function handleOpenChange(open: boolean) {
    if (open) return
    setAction(null)
    setConfirmText("")
  }

  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="text-destructive">Danger zone</CardTitle>
        <CardDescription>
          Actions here affect every environment.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col divide-y">
        {(Object.keys(ACTIONS) as Action[]).map((key) => (
          <div
            key={key}
            className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{ACTIONS[key].label}</span>
              <span className="text-xs text-muted-foreground">
                {ACTIONS[key].detail}
              </span>
            </div>
            <Button
              variant={key === "delete" ? "destructive" : "outline"}
              size="sm"
              onClick={() => setAction(key)}
            >
              {ACTIONS[key].button}
            </Button>
          </div>
        ))}
      </CardContent>
      <Dialog open={action !== null} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{current?.title}</DialogTitle>
            <DialogDescription>{current?.description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="danger-zone-confirm">
              Type{" "}
              <span className="font-mono text-foreground">{PROJECT_NAME}</span>{" "}
              to confirm
            </Label>
            <Input
              id="danger-zone-confirm"
              autoComplete="off"
              spellCheck={false}
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant={action === "delete" ? "destructive" : "default"}
              disabled={!isConfirmed}
              onClick={() => handleOpenChange(false)}
            >
              {current?.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
