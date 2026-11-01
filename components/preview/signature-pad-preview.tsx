"use client"

import * as React from "react"

import { SignaturePad } from "@/registry/default/ui/signature-pad"

export function SignaturePadPreview() {
  const [signature, setSignature] = React.useState("")

  return (
    <div className="grid w-full max-w-md gap-2">
      <SignaturePad
        aria-label="Delivery signature"
        value={signature}
        onValueChange={setSignature}
      />
      <p className="text-sm text-muted-foreground">
        {signature ? "Signed, ready to submit" : "Sign to confirm delivery"}
      </p>
    </div>
  )
}
