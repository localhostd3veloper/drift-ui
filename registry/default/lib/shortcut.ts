export type ShortcutModifier = "Ctrl" | "Alt" | "Shift" | "Mod" | "Meta"

type KeyboardEventLike = Pick<
  KeyboardEvent,
  "key" | "code" | "ctrlKey" | "altKey" | "shiftKey" | "metaKey"
>

const MODIFIER_KEYS = new Set([
  "Control",
  "Alt",
  "AltGraph",
  "Shift",
  "Meta",
  "OS",
  "CapsLock",
  "Fn",
])

const NAMED_KEYS: Record<string, string> = {
  " ": "Space",
  "+": "Plus",
  Esc: "Escape",
}

const MAC_LABELS: Record<string, string> = {
  Ctrl: "⌃",
  Alt: "⌥",
  Shift: "⇧",
  Mod: "⌘",
  Meta: "⌘",
  Enter: "↩",
  Backspace: "⌫",
  Delete: "⌦",
  Escape: "⎋",
  Tab: "⇥",
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
}

const PC_LABELS: Record<string, string> = {
  Mod: "Ctrl",
  Meta: "Win",
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
}

export function isModifierKey(key: string) {
  return MODIFIER_KEYS.has(key)
}

export function isFunctionKey(key: string) {
  return /^F\d{1,2}$/.test(key)
}

export function modifiersFromEvent(event: KeyboardEventLike, isMac: boolean) {
  const modifiers: ShortcutModifier[] = []
  if (event.ctrlKey) modifiers.push(isMac ? "Ctrl" : "Mod")
  if (event.altKey) modifiers.push("Alt")
  if (event.shiftKey) modifiers.push("Shift")
  if (event.metaKey) modifiers.push(isMac ? "Mod" : "Meta")
  return modifiers
}

export function keyFromEvent({ key, code }: KeyboardEventLike) {
  if (code.startsWith("Key")) return code.slice(3)
  if (code.startsWith("Digit")) return code.slice(5)
  if (key.length === 1) return NAMED_KEYS[key] ?? key.toUpperCase()
  return NAMED_KEYS[key] ?? key
}

export function shortcutFromEvent(event: KeyboardEventLike, isMac: boolean) {
  if (isModifierKey(event.key)) return null
  return [...modifiersFromEvent(event, isMac), keyFromEvent(event)].join("+")
}

export function matchesShortcut(
  event: KeyboardEventLike,
  shortcut: string,
  isMac: boolean
) {
  return shortcutFromEvent(event, isMac) === shortcut
}

export function splitShortcut(shortcut: string) {
  return shortcut ? shortcut.split("+") : []
}

export function shortcutKeyLabel(part: string, isMac: boolean) {
  const labels = isMac ? MAC_LABELS : PC_LABELS
  return labels[part] ?? part
}
