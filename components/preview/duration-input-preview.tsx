"use client"

import * as React from "react"

import { DurationInput } from "@/registry/default/ui/duration-input"
import { Label } from "@/registry/default/ui/label"

export function DurationInputPreview() {
  const [timeout, setTimeout] = React.useState<number | null>(5400000)

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label>Execution timeout</Label>
        <DurationInput
          aria-label="Execution timeout"
          value={timeout}
          onValueChange={setTimeout}
          units={["h", "m", "s"]}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Service SLA window</Label>
        <DurationInput
          aria-label="Service SLA window"
          defaultValue={187200000}
          units={["d", "h", "m"]}
        />
      </div>
      <p className="w-full text-center text-xs text-muted-foreground">
        Type or paste shorthand like 90m or 1h 30m.
      </p>
    </>
  )
}
