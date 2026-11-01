import { matchesShortcut } from "@/registry/default/lib/shortcut"

export type CheatsheetShortcut = {
  keys: string
  label: string
}

export type CheatsheetSection = {
  title: string
  shortcuts: CheatsheetShortcut[]
}

const EDITABLE_SELECTOR = "input,select,textarea,[contenteditable]"

export function filterSections(sections: CheatsheetSection[], query: string) {
  const needle = query.trim().toLowerCase()
  if (!needle) return sections

  return sections.flatMap((section) => {
    if (section.title.toLowerCase().includes(needle)) return [section]
    const shortcuts = section.shortcuts.filter(({ label }) =>
      label.toLowerCase().includes(needle)
    )
    return shortcuts.length > 0 ? [{ ...section, shortcuts }] : []
  })
}

export function matchesTrigger(
  event: KeyboardEvent,
  trigger: string,
  isMac: boolean
) {
  const { target, key, ctrlKey, altKey, metaKey } = event
  if (target instanceof Element && target.closest(EDITABLE_SELECTOR))
    return false
  if (key === trigger) return !ctrlKey && !altKey && !metaKey
  return matchesShortcut(event, trigger, isMac)
}
