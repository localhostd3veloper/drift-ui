"use client"

import * as React from "react"

import { InlineEdit } from "@/registry/default/ui/inline-edit"

export function InlineEditDemo() {
  const [workspaceName, setWorkspaceName] = React.useState("Acme Platform")
  const [region, setRegion] = React.useState("eu-west-1")

  return (
    <dl className="grid grid-cols-[5.5rem_1fr] items-center gap-x-4 gap-y-1 text-sm">
      <dt className="text-muted-foreground">Workspace</dt>
      <dd>
        <InlineEdit
          aria-label="Workspace name"
          value={workspaceName}
          onSave={setWorkspaceName}
        />
      </dd>
      <dt className="text-muted-foreground">Region</dt>
      <dd>
        <InlineEdit aria-label="Region" value={region} onSave={setRegion} />
      </dd>
    </dl>
  )
}
