"use client"

import * as React from "react"

import { SignaturePad } from "@/registry/default/ui/signature-pad"

export function SignaturePadPngPreview() {
  const [signature, setSignature] = React.useState("")

  return (
    <div className="grid w-full max-w-md gap-3">
      <SignaturePad
        aria-label="Consent signature"
        format="png"
        value={signature}
        onValueChange={setSignature}
      />
      {signature && (
        <p className="truncate font-mono text-xs text-muted-foreground">
          {signature}
        </p>
      )}
    </div>
  )
}
