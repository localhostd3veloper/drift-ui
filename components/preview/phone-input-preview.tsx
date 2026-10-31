"use client"

import * as React from "react"
import { isValidPhoneNumber } from "libphonenumber-js"

import { Label } from "@/registry/default/ui/label"
import { PhoneInput } from "@/registry/default/ui/phone-input"

export function PhoneInputPreview() {
  const [phone, setPhone] = React.useState("+14155550123")
  const isInvalid = phone !== "" && !isValidPhoneNumber(phone)

  return (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="phone-input-preview">Mobile number</Label>
      <PhoneInput
        id="phone-input-preview"
        aria-invalid={isInvalid}
        value={phone}
        onValueChange={setPhone}
        defaultCountry="US"
      />
      <p className="font-mono text-xs text-muted-foreground">
        Saved as {phone || "an empty string"}
      </p>
      <p className="mt-3 text-xs text-muted-foreground">
        Try it: paste +44 20 7946 0958, or pick a country and keep typing.
      </p>
    </div>
  )
}
