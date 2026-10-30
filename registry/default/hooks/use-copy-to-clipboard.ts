"use client"

import * as React from "react"

const COPIED_RESET_MS = 1600

export function useCopyToClipboard() {
  const [copied, setCopied] = React.useState<string | null>(null)
  const resetTimerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(resetTimerRef.current), [])

  async function copy(text: string, key = text) {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    clearTimeout(resetTimerRef.current)
    resetTimerRef.current = setTimeout(() => setCopied(null), COPIED_RESET_MS)
  }

  return { copied, copy }
}
