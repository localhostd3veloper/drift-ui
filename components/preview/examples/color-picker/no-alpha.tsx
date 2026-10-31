import { ColorPicker } from "@/registry/default/ui/color-picker"

export function ColorPickerNoAlphaPreview() {
  return (
    <ColorPicker
      aria-label="Brand color"
      defaultValue="#22c55e"
      showAlpha={false}
    />
  )
}
