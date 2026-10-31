"use client"

import * as React from "react"

import { DateTimeRangePicker } from "@/registry/default/ui/date-time-range"
import { Label } from "@/registry/default/ui/label"

export function DateTimeRangeControlledPreview() {
  const [range, setRange] = React.useState<{ from?: Date; to?: Date }>({})

  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="range-controlled">Freeze window</Label>
      <DateTimeRangePicker
        id="range-controlled"
        locale="en-GB"
        value={range}
        onValueChange={setRange}
      />
      <p className="font-mono text-xs text-muted-foreground">
        {range.from?.toISOString() ?? "no start"}
        <br />
        {range.to?.toISOString() ?? "no end"}
      </p>
    </div>
  )
}
