"use client"

import * as React from "react"

import { Button } from "@/registry/default/ui/button"
import { DurationInput } from "@/registry/default/ui/duration-input"
import { Label } from "@/registry/default/ui/label"

export function DurationInputFormPreview() {
  const [submitted, setSubmitted] = React.useState("")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(String(new FormData(event.currentTarget).get("timeout")))
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-64 flex-col gap-2">
      <Label>Job timeout</Label>
      <DurationInput
        aria-label="Job timeout"
        name="timeout"
        defaultValue={90_000}
      />
      <Button type="submit" className="mt-1">
        Save
      </Button>
      {submitted && (
        <p className="font-mono text-xs text-muted-foreground">
          timeout={submitted}
        </p>
      )}
    </form>
  )
}
