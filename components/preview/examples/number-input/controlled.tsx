"use client"

import * as React from "react"

import { Label } from "@/registry/default/ui/label"
import { NumberInput } from "@/registry/default/ui/number-input"

export function NumberInputControlledPreview() {
  const [seats, setSeats] = React.useState<number | null>(5)

  return (
    <div className="grid w-48 gap-2">
      <Label htmlFor="number-controlled">Seats</Label>
      <NumberInput
        id="number-controlled"
        value={seats}
        onValueChange={setSeats}
        min={1}
      />
      <p className="text-xs text-muted-foreground">
        {seats === null ? "Enter a seat count" : `$${seats * 12} a month`}
      </p>
    </div>
  )
}
