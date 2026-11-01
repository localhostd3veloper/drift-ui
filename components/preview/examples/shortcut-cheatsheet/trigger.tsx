import { ShortcutCheatsheet } from "@/registry/default/ui/shortcut-cheatsheet"
import { ShortcutKeys } from "@/registry/default/ui/shortcut-recorder"

export function ShortcutCheatsheetTriggerPreview() {
  return (
    <>
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        Press <ShortcutKeys shortcut="Mod+/" />
      </p>
      <ShortcutCheatsheet
        trigger="Mod+/"
        sections={[
          {
            title: "General",
            shortcuts: [
              { keys: "Mod+/", label: "Show shortcuts" },
              { keys: "Mod+,", label: "Open settings" },
            ],
          },
        ]}
      />
    </>
  )
}
