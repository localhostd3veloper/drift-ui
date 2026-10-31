import { ColorPicker } from "@/registry/default/ui/color-picker"

export function ColorPickerTriggerPreview() {
  return (
    <div className="flex items-center gap-3">
      <ColorPicker
        aria-label="Text color"
        defaultValue="#0f172a"
        variant="ghost"
        size="sm"
      />
      <ColorPicker
        aria-label="Fill color"
        defaultValue="#f59e0b"
        variant="secondary"
        size="lg"
      />
    </div>
  )
}
