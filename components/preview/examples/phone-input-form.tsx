"use client"

import * as React from "react"

import { Button } from "@/registry/default/ui/button"
import { Label } from "@/registry/default/ui/label"
import { PhoneInput } from "@/registry/default/ui/phone-input"

export function PhoneInputFormPreview() {
  const [submitted, setSubmitted] = React.useState("")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(String(new FormData(event.currentTarget).get("phone")))
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-72 flex-col gap-2">
      <Label htmlFor="phone-form">Mobile number</Label>
      <PhoneInput id="phone-form" name="phone" defaultValue="+919876543210" />
      <Button type="submit" className="mt-1">
        Save
      </Button>
      {submitted && (
        <p className="font-mono text-xs text-muted-foreground">
          phone={submitted}
        </p>
      )}
    </form>
  )
}
