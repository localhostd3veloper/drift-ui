"use client"

import * as React from "react"

import {
  DescriptionItem,
  DescriptionList,
} from "@/registry/default/ui/description-list"

const SIMULATED_SAVE_MS = 600

export function DescriptionListAsyncSavePreview() {
  const [name, setName] = React.useState("Ledgerline")

  async function saveName(next: string) {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_SAVE_MS))
    if (!next) throw new Error("A name is required")
    setName(next)
  }

  return (
    <DescriptionList className="w-full max-w-md">
      <DescriptionItem label="Workspace" editable onValueChange={saveName}>
        {name}
      </DescriptionItem>
    </DescriptionList>
  )
}
