"use client"

import * as React from "react"

import { Button } from "@/registry/default/ui/button"
import { Label } from "@/registry/default/ui/label"
import { TimeField } from "@/registry/default/ui/time-field"

export function TimeFieldFormPreview() {
  const [submitted, setSubmitted] = React.useState("")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(String(new FormData(event.currentTarget).get("starts_at")))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Label>Starts at</Label>
      <TimeField aria-label="Starts at" name="starts_at" defaultValue="09:00" />
      <Button type="submit" className="mt-1">
        Save
      </Button>
      {submitted && (
        <p className="font-mono text-xs text-muted-foreground">
          starts_at={submitted}
        </p>
      )}
    </form>
  )
}
