import { useSyncExternalStore } from "react"

const CLOCK_TICK_MS = 50
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

const clockListeners = new Set<() => void>()
let elapsedMs = 0
let clockIntervalId: ReturnType<typeof setInterval> | undefined

function startClock() {
  let lastTickAt = performance.now()
  clockIntervalId = setInterval(() => {
    const now = performance.now()
    if (!document.hidden) elapsedMs += now - lastTickAt
    lastTickAt = now
    clockListeners.forEach((listener) => listener())
  }, CLOCK_TICK_MS)
}

function subscribeToClock(listener: () => void) {
  clockListeners.add(listener)
  if (clockListeners.size === 1) startClock()

  return () => {
    clockListeners.delete(listener)
    if (clockListeners.size > 0) return
    clearInterval(clockIntervalId)
    clockIntervalId = undefined
  }
}

function subscribeToReducedMotion(listener: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY)
  mediaQuery.addEventListener("change", listener)
  return () => mediaQuery.removeEventListener("change", listener)
}

function getPrefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

export function useDemoFrame({
  frameMs,
  frameCount,
  reducedMotionFrame,
}: {
  frameMs: number
  frameCount: number
  reducedMotionFrame: number
}) {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getPrefersReducedMotion,
    () => false
  )
  const frame = useSyncExternalStore(
    subscribeToClock,
    () => Math.floor(elapsedMs / frameMs) % frameCount,
    () => 0
  )

  return prefersReducedMotion ? reducedMotionFrame : frame
}
