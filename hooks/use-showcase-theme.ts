import { useSyncExternalStore } from "react"

import {
  EMPTY_THEME,
  formatThemeCss,
  isEmptyTheme,
  parseThemeCss,
  type Theme,
} from "@/lib/theme-css"

const STORAGE_KEY = "drift-ui:showcase-theme"

const listeners = new Set<() => void>()
let currentTheme: Theme | null = null

function loadStoredTheme() {
  try {
    return parseThemeCss(window.localStorage.getItem(STORAGE_KEY) ?? "")
  } catch {
    return EMPTY_THEME
  }
}

function persistTheme(theme: Theme) {
  try {
    if (isEmptyTheme(theme)) window.localStorage.removeItem(STORAGE_KEY)
    else window.localStorage.setItem(STORAGE_KEY, formatThemeCss(theme))
  } catch {}
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  currentTheme ??= loadStoredTheme()
  return currentTheme
}

function getServerSnapshot() {
  return EMPTY_THEME
}

export function useShowcaseTheme() {
  //#region queries
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  //#endregion

  //#region mutations
  function setTheme(next: Theme) {
    currentTheme = next
    persistTheme(next)
    listeners.forEach((listener) => listener())
  }

  function resetTheme() {
    setTheme(EMPTY_THEME)
  }
  //#endregion

  return { theme, setTheme, resetTheme }
}
