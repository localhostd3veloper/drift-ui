"use client"

import { PresetPicker } from "@/components/showcase/preset-picker"
import { useShowcaseTheme } from "@/hooks/use-showcase-theme"
import { applyPreset, findActivePreset } from "@/lib/showcase-presets"

export function ScreensThemePicker() {
  const { theme, setTheme } = useShowcaseTheme()

  return (
    <div role="group" aria-label="Theme preset">
      <PresetPicker
        activePresetId={findActivePreset(theme)?.id}
        onSelect={(preset) => setTheme(applyPreset(theme, preset))}
        className="-m-1 [scrollbar-width:none] auto-cols-[5.5rem] grid-flow-col grid-cols-none overflow-x-auto p-1 sm:auto-cols-auto sm:grid-flow-row sm:grid-cols-6 sm:overflow-visible xl:grid-cols-12"
      />
    </div>
  )
}
