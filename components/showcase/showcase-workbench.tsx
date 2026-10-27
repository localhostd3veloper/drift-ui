"use client"

import { ThemePanel } from "@/components/showcase/theme-panel"
import { useShowcaseTheme } from "@/hooks/use-showcase-theme"
import { scopeThemeCss } from "@/lib/theme-css"

const THEME_SCOPE = [
  "[data-showcase-canvas]",
  '[data-radix-popper-content-wrapper]:not(:has([role="tooltip"]))',
  '[data-slot="dialog-content"]:not([data-theme-editor])',
]

export function ShowcaseWorkbench({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, resetTheme } = useShowcaseTheme()

  return (
    <div className="grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
      <style>{scopeThemeCss(theme, THEME_SCOPE)}</style>
      <ThemePanel
        theme={theme}
        onThemeChange={setTheme}
        onReset={resetTheme}
        className="lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto"
      />
      <div
        data-showcase-canvas
        className="@container min-w-0 rounded-3xl border bg-background p-3 font-sans text-foreground sm:p-4"
      >
        {children}
      </div>
    </div>
  )
}
