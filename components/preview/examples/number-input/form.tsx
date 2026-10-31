"use client"

import * as React from "react"

import { Button } from "@/registry/default/ui/button"
import { Label } from "@/registry/default/ui/label"
import { NumberInput } from "@/registry/default/ui/number-input"

export function NumberInputFormPreview() {
  const [submitted, setSubmitted] = React.useState("")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(String(new FormData(event.currentTarget).get("price")))
  }

  return (
    <form onSubmit={handleSubmit} className="grid w-52 gap-2">
      <Label htmlFor="number-form">Price</Label>
      <NumberInput
        id="number-form"
        name="price"
        defaultValue={1499.5}
        locale="en-US"
        formatOptions={{ style: "currency", currency: "USD" }}
      />
      <Button type="submit" className="mt-1">
        Save
      </Button>
      {submitted && (
        <p className="font-mono text-xs text-muted-foreground">
          price={submitted}
        </p>
      )}
    </form>
  )
}
