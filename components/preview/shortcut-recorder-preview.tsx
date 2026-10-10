import { Label } from "@/registry/default/ui/label"
import {
  ShortcutKeys,
  ShortcutRecorder,
} from "@/registry/default/ui/shortcut-recorder"

export function ShortcutRecorderPreview() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Label>Open command menu</Label>
        <ShortcutRecorder defaultValue="Mod+K" aria-label="Open command menu" />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Toggle sidebar</Label>
        <ShortcutRecorder aria-label="Toggle sidebar" />
      </div>
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        Display only <ShortcutKeys shortcut="Mod+Shift+P" />
      </p>
    </>
  )
}
