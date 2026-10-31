"use client"

import * as React from "react"

import { Label } from "@/registry/default/ui/label"
import { MultiSelect } from "@/registry/default/ui/multi-select"

const TEAMS = [
  { value: "platform", label: "Platform" },
  { value: "design", label: "Design" },
  { value: "support", label: "Support" },
  { value: "billing", label: "Billing" },
]

export function MultiSelectControlledPreview() {
  const [teams, setTeams] = React.useState(["platform", "support"])

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="multi-select-controlled">Notify teams</Label>
      <MultiSelect
        id="multi-select-controlled"
        options={TEAMS}
        value={teams}
        onValueChange={setTeams}
      />
      <p className="font-mono text-xs text-muted-foreground">
        {JSON.stringify(teams)}
      </p>
    </div>
  )
}
