"use client"

import { useShowcaseTheme } from "@/hooks/use-showcase-theme"
import { isEmptyTheme, scopeThemeCss } from "@/lib/theme-css"

const THEME_SCOPE = [
  "[data-theme-scope]",
  "[data-showcase-canvas]",
  '[data-radix-popper-content-wrapper]:not(:has([role="tooltip"], [data-theme-control]))',
  '[data-slot="dialog-content"]:not([data-theme-editor])',
]

export function ThemeScopeStyle() {
  const { theme } = useShowcaseTheme()
  if (isEmptyTheme(theme)) return null

  return <style>{scopeThemeCss(theme, THEME_SCOPE)}</style>
}
