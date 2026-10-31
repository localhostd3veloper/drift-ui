import { ShortcutKeys } from "@/registry/default/ui/shortcut-recorder"

const COMMANDS = [
  { label: "Search", shortcut: "Mod+K" },
  { label: "New issue", shortcut: "Mod+Shift+N" },
  { label: "Toggle sidebar", shortcut: "Mod+B" },
]

export function ShortcutRecorderKeysPreview() {
  return (
    <ul className="flex w-64 flex-col gap-2 text-sm">
      {COMMANDS.map((command) => (
        <li key={command.label} className="flex justify-between gap-4">
          {command.label}
          <ShortcutKeys shortcut={command.shortcut} />
        </li>
      ))}
    </ul>
  )
}
