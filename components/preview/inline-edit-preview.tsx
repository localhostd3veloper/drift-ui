"use client"

import * as React from "react"

import { InlineEdit } from "@/registry/default/ui/inline-edit"

const SIMULATED_SAVE_MS = 600

export function InlineEditPreview() {
  const [projectName, setProjectName] = React.useState("Billing migration")
  const [owner, setOwner] = React.useState("")

  async function saveProjectName(next: string) {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_SAVE_MS))
    setProjectName(next)
  }

  return (
    <>
      <dl className="grid w-full max-w-sm grid-cols-[6rem_1fr] items-center gap-x-4 gap-y-1 text-sm">
        <dt className="text-muted-foreground">Project</dt>
        <dd>
          <InlineEdit
            aria-label="Project name"
            value={projectName}
            onSave={saveProjectName}
          />
        </dd>
        <dt className="text-muted-foreground">Owner</dt>
        <dd>
          <InlineEdit
            aria-label="Owner"
            value={owner}
            placeholder="Unassigned"
            onSave={setOwner}
          />
        </dd>
      </dl>
    </>
  )
}
