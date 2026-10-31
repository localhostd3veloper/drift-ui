"use client"

import * as React from "react"

import { InlineEdit } from "@/registry/default/ui/inline-edit"

export function InlineEditValidationPreview() {
  const [slug, setSlug] = React.useState("billing-migration")

  function saveSlug(next: string) {
    if (!/^[a-z0-9-]+$/.test(next)) throw new Error("Invalid slug")
    setSlug(next)
  }

  return (
    <div className="w-full max-w-xs">
      <InlineEdit aria-label="Project slug" value={slug} onSave={saveSlug} />
      <p className="mt-2 text-xs text-muted-foreground">
        Lowercase letters, numbers and dashes. Try adding a space.
      </p>
    </div>
  )
}
