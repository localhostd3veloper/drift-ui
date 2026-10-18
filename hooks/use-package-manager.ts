import { useSyncExternalStore } from "react"

import { isPackageManager, type PackageManager } from "@/lib/package-manager"

const STORAGE_KEY = "drift-ui:package-manager"
const DEFAULT_PACKAGE_MANAGER: PackageManager = "npm"

const listeners = new Set<() => void>()
let memoryValue: PackageManager = DEFAULT_PACKAGE_MANAGER

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener("storage", listener)

  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", listener)
  }
}

function getSnapshot(): PackageManager {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return isPackageManager(stored) ? stored : memoryValue
  } catch {
    return memoryValue
  }
}

function getServerSnapshot() {
  return DEFAULT_PACKAGE_MANAGER
}

export function usePackageManager() {
  //#region queries
  const packageManager = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
  //#endregion

  //#region mutations
  function setPackageManager(next: PackageManager) {
    memoryValue = next
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {}
    listeners.forEach((listener) => listener())
  }
  //#endregion

  return { packageManager, setPackageManager }
}
