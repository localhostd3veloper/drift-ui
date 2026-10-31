"use client"

import * as React from "react"
import { isValidPhoneNumber } from "libphonenumber-js"

import { Label } from "@/registry/default/ui/label"
import { PhoneInput } from "@/registry/default/ui/phone-input"

export function PhoneInputValidationPreview() {
  const [phone, setPhone] = React.useState("+1415555")
  const isInvalid = phone !== "" && !isValidPhoneNumber(phone)

  return (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="phone-validation">Mobile number</Label>
      <PhoneInput
        id="phone-validation"
        aria-invalid={isInvalid}
        aria-describedby="phone-validation-message"
        value={phone}
        onValueChange={setPhone}
      />
      <p
        id="phone-validation-message"
        className="text-xs text-muted-foreground"
      >
        {isInvalid ? "Enter a complete number." : "Looks good."}
      </p>
    </div>
  )
}
