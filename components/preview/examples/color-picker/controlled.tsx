"use client"

import * as React from "react"

import { Badge } from "@/registry/default/ui/badge"
import { ColorPicker } from "@/registry/default/ui/color-picker"

export function ColorPickerControlledPreview() {
  const [color, setColor] = React.useState("#6366f1")

  return (
    <div className="flex items-center gap-3">
      <ColorPicker
        aria-label="Label color"
        value={color}
        onValueChange={setColor}
      />
      <Badge variant="outline" style={{ borderColor: color, color }}>
        In review
      </Badge>
    </div>
  )
}
