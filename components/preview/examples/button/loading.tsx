"use client"

import * as React from "react"
import { Loader2Icon } from "lucide-react"

import { Button } from "@/registry/default/ui/button"

const SIMULATED_SAVE_MS = 1500

export function ButtonLoadingPreview() {
  const [isSaving, setIsSaving] = React.useState(false)

  function save() {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), SIMULATED_SAVE_MS)
  }

  return (
    <Button disabled={isSaving} onClick={save}>
      {isSaving && <Loader2Icon className="animate-spin" />}
      {isSaving ? "Saving" : "Save changes"}
    </Button>
  )
}
