import { ColorPicker } from "@/registry/default/ui/color-picker"

const BRAND_SWATCHES = [
  "#0f172a",
  "#64748b",
  "#ef4444",
  "#f59e0b",
  "#22c55e",
  "#06b6d4",
  "#6366f1",
  "#d946ef",
]

export function ColorPickerPreview() {
  return (
    <>
      <ColorPicker
        aria-label="Accent color"
        defaultValue="#6366f1"
        swatches={BRAND_SWATCHES}
      />
      <ColorPicker aria-label="Border color" defaultValue="#64748b80" />
    </>
  )
}
