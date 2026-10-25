"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@/registry/default/ui/button"

const COPIED_RESET_MS = 1800

export function CopyTextButton({
  text,
  label,
  copiedLabel = "Copied",
  className,
}: {
  text: string
  label: string
  copiedLabel?: string
  className?: string
}) {
  const [hasCopied, setHasCopied] = React.useState(false)
  const resetTimerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(resetTimerRef.current), [])

  async function copyText() {
    await navigator.clipboard.writeText(text)
    setHasCopied(true)
    clearTimeout(resetTimerRef.current)
    resetTimerRef.current = setTimeout(
      () => setHasCopied(false),
      COPIED_RESET_MS
    )
  }

  return (
    <Button size="sm" onClick={copyText} className={className}>
      {hasCopied ? <CheckIcon /> : <CopyIcon />}
      <span aria-live="polite">{hasCopied ? copiedLabel : label}</span>
    </Button>
  )
}
