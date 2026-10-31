"use client"

import * as React from "react"

import { Label } from "@/registry/default/ui/label"
import { TimeField } from "@/registry/default/ui/time-field"

export function TimeFieldControlledPreview() {
  const [time, setTime] = React.useState("14:30")

  return (
    <div className="flex flex-col gap-2">
      <Label>Daily digest</Label>
      <TimeField
        aria-label="Daily digest"
        hourCycle={12}
        value={time}
        onValueChange={setTime}
      />
      <p className="font-mono text-xs text-muted-foreground">
        {time || "cleared"}
      </p>
    </div>
  )
}
