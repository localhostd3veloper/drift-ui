import { useSyncExternalStore } from "react"

function subscribeToNothing() {
  return () => {}
}

export function useHasHydrated() {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  )
}
