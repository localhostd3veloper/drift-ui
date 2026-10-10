import { describe, expect, it } from "vitest"

import {
  isFunctionKey,
  isModifierKey,
  matchesShortcut,
  shortcutFromEvent,
  shortcutKeyLabel,
  splitShortcut,
} from "@/registry/default/lib/shortcut"

function keyEvent(overrides: Partial<KeyboardEvent>) {
  return {
    key: "",
    code: "",
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    ...overrides,
  }
}

describe("shortcut", () => {
  it("stores Ctrl on other platforms and Cmd on macOS as Mod", () => {
    expect(
      shortcutFromEvent(
        keyEvent({ key: "k", code: "KeyK", ctrlKey: true }),
        false
      )
    ).toBe("Mod+K")
    expect(
      shortcutFromEvent(
        keyEvent({ key: "k", code: "KeyK", metaKey: true }),
        true
      )
    ).toBe("Mod+K")
    expect(
      shortcutFromEvent(
        keyEvent({ key: "k", code: "KeyK", ctrlKey: true }),
        true
      )
    ).toBe("Ctrl+K")
  })

  it("uses the physical key so Shift does not change the recorded key", () => {
    expect(
      shortcutFromEvent(
        keyEvent({ key: "!", code: "Digit1", ctrlKey: true, shiftKey: true }),
        false
      )
    ).toBe("Mod+Shift+1")
  })

  it("returns null while only a modifier is held", () => {
    expect(
      shortcutFromEvent(
        keyEvent({ key: "Shift", code: "ShiftLeft", shiftKey: true }),
        false
      )
    ).toBeNull()
    expect(isModifierKey("Control")).toBe(true)
    expect(isFunctionKey("F12")).toBe(true)
    expect(isFunctionKey("Fn")).toBe(false)
  })

  it("matches events against a stored shortcut", () => {
    expect(
      matchesShortcut(
        keyEvent({ key: "p", code: "KeyP", ctrlKey: true, shiftKey: true }),
        "Mod+Shift+P",
        false
      )
    ).toBe(true)
    expect(
      matchesShortcut(
        keyEvent({ key: "p", code: "KeyP", ctrlKey: true }),
        "Mod+Shift+P",
        false
      )
    ).toBe(false)
  })

  it("renders platform labels", () => {
    expect(
      splitShortcut("Mod+Shift+K").map((part) => shortcutKeyLabel(part, true))
    ).toEqual(["⌘", "⇧", "K"])
    expect(
      splitShortcut("Mod+K").map((part) => shortcutKeyLabel(part, false))
    ).toEqual(["Ctrl", "K"])
    expect(splitShortcut("")).toEqual([])
  })
})
