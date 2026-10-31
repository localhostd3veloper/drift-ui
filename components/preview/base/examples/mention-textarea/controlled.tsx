"use client"

import * as React from "react"

import { MentionTextarea } from "@/registry/base/ui/mention-textarea"

const TRIGGERS = {
  "@": [
    { value: "noor", label: "Noor Haddad" },
    { value: "kofi", label: "Kofi Mensah" },
    { value: "ilse", label: "Ilse Marchetti" },
  ],
}

export function MentionTextareaControlledPreview() {
  const [text, setText] = React.useState("Thanks @kofi, can you check this?")
  const mentioned = text.match(/@[\w-]+/g) ?? []

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <MentionTextarea
        aria-label="Comment"
        triggers={TRIGGERS}
        value={text}
        onValueChange={setText}
      />
      <p className="text-xs text-muted-foreground">
        Notifies: {mentioned.join(", ") || "nobody"}
      </p>
    </div>
  )
}
