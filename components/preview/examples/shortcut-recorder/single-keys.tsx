import { Label } from "@/registry/default/ui/label"
import { ShortcutRecorder } from "@/registry/default/ui/shortcut-recorder"

export function ShortcutRecorderSingleKeysPreview() {
  return (
    <div className="flex flex-col gap-2">
      <Label>Next item</Label>
      <ShortcutRecorder
        aria-label="Next item"
        defaultValue="J"
        requireModifier={false}
      />
    </div>
  )
}
