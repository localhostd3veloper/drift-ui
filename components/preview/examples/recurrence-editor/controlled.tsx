"use client"

import * as React from "react"

import {
  describeRecurrence,
  parseRRule,
} from "@/registry/default/lib/recurrence"
import { RecurrenceEditor } from "@/registry/default/ui/recurrence-editor"

const START = new Date(2026, 10, 3, 10, 0)

export function RecurrenceEditorControlledPreview() {
  const [rule, setRule] = React.useState("FREQ=WEEKLY;BYDAY=TU,TH")

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <RecurrenceEditor
        aria-label="Repeat"
        value={rule}
        onValueChange={setRule}
        start={START}
      />
      <p className="font-mono text-xs break-all text-muted-foreground">
        {rule}
      </p>
      <p className="text-sm">{describeRecurrence(parseRRule(rule), START)}</p>
    </div>
  )
}
