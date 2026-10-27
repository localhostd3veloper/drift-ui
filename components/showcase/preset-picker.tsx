import { cn } from "@/registry/default/lib/utils"
import { THEME_PRESETS, type ThemePreset } from "@/lib/showcase-presets"
import { scopeThemeCss } from "@/lib/theme-css"

const PRESET_SWATCH_CSS = THEME_PRESETS.map((preset) =>
  scopeThemeCss(preset.theme, [`[data-preset-swatch="${preset.id}"]`])
).join("\n")

const SWATCH_CHIPS = [
  "bg-background",
  "bg-muted",
  "bg-primary",
  "bg-foreground",
]

export function PresetPicker({
  activePresetId,
  onSelect,
  className,
}: {
  activePresetId: string | undefined
  onSelect: (preset: ThemePreset) => void
  className?: string
}) {
  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      <style>{PRESET_SWATCH_CSS}</style>
      {THEME_PRESETS.map((preset) => (
        <button
          key={preset.id}
          type="button"
          aria-pressed={preset.id === activePresetId}
          onClick={() => onSelect(preset)}
          className="group flex flex-col gap-1.5 rounded-lg border p-1.5 text-left text-xs text-muted-foreground transition-colors outline-none hover:border-foreground/25 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-pressed:border-foreground/60 aria-pressed:text-foreground"
        >
          <span
            aria-hidden
            data-preset-swatch={preset.id}
            className="grid h-7 grid-cols-4 overflow-hidden rounded-md border border-border"
          >
            {SWATCH_CHIPS.map((chip) => (
              <span key={chip} className={chip} />
            ))}
          </span>
          <span className="px-0.5">{preset.label}</span>
        </button>
      ))}
    </div>
  )
}
