import { describe, expect, it } from "vitest"

import {
  filterSections,
  matchesTrigger,
} from "@/registry/default/lib/shortcut-cheatsheet"

const SECTIONS = [
  {
    title: "Navigation",
    shortcuts: [
      { keys: "Mod+K", label: "Search" },
      { keys: "G", label: "Go to inbox" },
    ],
  },
  {
    title: "Editing",
    shortcuts: [{ keys: "Mod+Enter", label: "Send message" }],
  },
]

function pressOn(target: EventTarget, init: KeyboardEventInit) {
  const event = new KeyboardEvent("keydown", { bubbles: true, ...init })
  target.dispatchEvent(event)
  return event
}

describe("filterSections", () => {
  it("returns every section for a blank query", () => {
    expect(filterSections(SECTIONS, "  ")).toBe(SECTIONS)
  })

  it("keeps only matching shortcuts, ignoring case and dropping empty sections", () => {
    expect(filterSections(SECTIONS, "INBOX")).toEqual([
      {
        title: "Navigation",
        shortcuts: [{ keys: "G", label: "Go to inbox" }],
      },
    ])
  })

  it("keeps a whole section when its title matches", () => {
    expect(filterSections(SECTIONS, "edit")).toEqual([SECTIONS[1]])
  })

  it("returns nothing when no label or title matches", () => {
    expect(filterSections(SECTIONS, "zzz")).toEqual([])
  })
})

describe("matchesTrigger", () => {
  it("matches a character the keyboard produces with Shift", () => {
    const event = pressOn(document.body, {
      key: "?",
      code: "Slash",
      shiftKey: true,
    })
    expect(matchesTrigger(event, "?", false)).toBe(true)
  })

  it("rejects a character held with a command modifier", () => {
    const event = pressOn(document.body, {
      key: "?",
      code: "Slash",
      shiftKey: true,
      metaKey: true,
    })
    expect(matchesTrigger(event, "?", true)).toBe(false)
  })

  it("matches a recorded shortcut for the platform", () => {
    const event = pressOn(document.body, {
      key: "/",
      code: "Slash",
      metaKey: true,
    })
    expect(matchesTrigger(event, "Mod+/", true)).toBe(true)
    expect(matchesTrigger(event, "Mod+/", false)).toBe(false)
  })

  it("never matches an empty trigger", () => {
    const event = pressOn(document.body, { key: "a", code: "KeyA" })
    expect(matchesTrigger(event, "", false)).toBe(false)
  })

  it.each(["input", "textarea", "select"])("ignores keys in a %s", (tag) => {
    const field = document.createElement(tag)
    document.body.append(field)
    const event = pressOn(field, { key: "?" })
    field.remove()
    expect(matchesTrigger(event, "?", false)).toBe(false)
  })

  it("ignores keys inside contenteditable", () => {
    const editor = document.createElement("div")
    editor.setAttribute("contenteditable", "true")
    const child = editor.appendChild(document.createElement("span"))
    document.body.append(editor)
    const event = pressOn(child, { key: "?" })
    editor.remove()
    expect(matchesTrigger(event, "?", false)).toBe(false)
  })
})
