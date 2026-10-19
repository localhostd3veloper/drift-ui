import { useEffect, useRef, useState } from "react"

const COPIED_RESET_MS = 1600

export function useCopyToClipboard() {
  const [hasCopied, setHasCopied] = useState(false)
  const resetTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(resetTimerRef.current), [])

  async function copy(value: string) {
    await navigator.clipboard.writeText(value)
    setHasCopied(true)
    clearTimeout(resetTimerRef.current)
    resetTimerRef.current = setTimeout(
      () => setHasCopied(false),
      COPIED_RESET_MS
    )
  }

  return { hasCopied, copy }
}
