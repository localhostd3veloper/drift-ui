import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { EmojiPicker } from "@/registry/default/ui/emoji-picker"

vi.mock("emojibase-data/en/data.json", () => {
  const entry = (
    hexcode: string,
    emoji: string,
    label: string,
    group: number,
    order: number,
    skins?: { emoji: string; tone: number }[]
  ) => ({ hexcode, emoji, label, group, order, skins, tags: [], version: 1 })

  return {
    default: [
      entry("1F600", "😀", "grinning face", 0, 1),
      entry("1F603", "😃", "grinning face with big eyes", 0, 2),
      entry("1F44B", "👋", "waving hand", 1, 3, [
        { emoji: "👋🏻", tone: 1 },
        { emoji: "👋🏽", tone: 3 },
      ]),
      entry("1F435", "🐵", "monkey face", 3, 4),
      entry("1F355", "🍕", "pizza", 4, 5),
      entry("1F3F4", "🏴", "black flag", 9, 6),
    ],
  }
})

async function renderPicker(
  props: React.ComponentProps<typeof EmojiPicker> = {}
) {
  const view = render(<EmojiPicker {...props} />)
  await screen.findByRole("button", { name: "grinning face" })
  return view
}

function emojiButton(name: string) {
  return screen.getByRole("button", { name })
}

function searchbox() {
  return screen.getByRole("searchbox", { name: "Search emoji" })
}

describe("EmojiPicker", () => {
  beforeEach(() => localStorage.clear())

  it("shows a loading message, then the labelled grid", async () => {
    render(<EmojiPicker />)

    expect(screen.getByText("Loading emoji")).toBeInTheDocument()

    const grid = await screen.findByRole("grid", { name: "Emoji" })
    expect(
      within(grid).getByRole("rowgroup", { name: "Smileys & emotion" })
    ).toBeInTheDocument()
    expect(
      within(grid).getByRole("rowgroup", { name: "Flags" })
    ).toBeInTheDocument()
    expect(screen.queryByText("Loading emoji")).not.toBeInTheDocument()
  })

  it("calls onSelect with the emoji", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    await renderPicker({ onSelect })

    await user.click(emojiButton("grinning face"))

    expect(onSelect).toHaveBeenCalledWith("😀")
  })

  it("filters by search and announces the count", async () => {
    const user = userEvent.setup()
    await renderPicker()

    await user.type(searchbox(), "pizza")

    expect(emojiButton("pizza")).toBeInTheDocument()
    expect(screen.queryByText("Smileys & emotion")).not.toBeInTheDocument()
    expect(screen.getByRole("status")).toHaveTextContent("1 result")
  })

  it("says when nothing matches", async () => {
    const user = userEvent.setup()
    await renderPicker()

    await user.type(searchbox(), "zzzzz")

    expect(screen.getByText("No emoji found")).toBeInTheDocument()
    expect(screen.getByRole("status")).toHaveTextContent("0 results")
  })

  it("picks the first result with Enter from the search field", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    await renderPicker({ onSelect })

    await user.type(searchbox(), "pizza{Enter}")

    expect(onSelect).toHaveBeenCalledWith("🍕")
  })

  it("moves between search and the grid with the arrow keys", async () => {
    const user = userEvent.setup()
    await renderPicker()

    await user.click(searchbox())
    await user.keyboard("{ArrowDown}")
    expect(emojiButton("grinning face")).toHaveFocus()

    await user.keyboard("{ArrowRight}")
    expect(emojiButton("grinning face with big eyes")).toHaveFocus()

    await user.keyboard("{ArrowUp}")
    expect(searchbox()).toHaveFocus()
  })

  it("keeps one tab stop in the grid, which follows focus", async () => {
    const user = userEvent.setup()
    await renderPicker()

    await user.click(searchbox())
    await user.tab()
    expect(emojiButton("grinning face")).toHaveFocus()

    await user.keyboard("{ArrowRight}")
    expect(emojiButton("grinning face")).toHaveAttribute("tabindex", "-1")
    expect(emojiButton("grinning face with big eyes")).toHaveAttribute(
      "tabindex",
      "0"
    )
    expect(
      screen.getAllByRole("button").filter((button) => button.tabIndex === 0)
    ).toHaveLength(1)
  })

  it("pages between categories", async () => {
    const user = userEvent.setup()
    await renderPicker()
    const people = screen.getByRole("rowgroup", { name: "People & body" })

    await user.click(searchbox())
    await user.keyboard("{ArrowDown}{PageDown}")

    expect(within(people).getAllByRole("button")[0]).toHaveFocus()
  })

  it("selects with Enter and Space on a focused emoji", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    await renderPicker({ onSelect })

    await user.click(searchbox())
    await user.keyboard("{ArrowDown}{Enter} ")

    expect(onSelect).toHaveBeenCalledTimes(2)
  })

  it("applies the chosen skin tone to display and selection", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const onSkinToneChange = vi.fn()
    await renderPicker({ onSelect, onSkinToneChange })

    await user.click(screen.getByRole("radio", { name: "Medium" }))
    expect(onSkinToneChange).toHaveBeenCalledWith(3)
    expect(emojiButton("waving hand")).toHaveTextContent("👋🏽")

    await user.click(emojiButton("waving hand"))
    expect(onSelect).toHaveBeenCalledWith("👋🏽")
  })

  it("moves through skin tones with the arrow keys", async () => {
    const user = userEvent.setup()
    await renderPicker()

    screen.getByRole("radio", { name: "Default" }).focus()
    await user.keyboard("{ArrowRight}")

    expect(screen.getByRole("radio", { name: "Light" })).toBeChecked()
  })

  it("supports a controlled skin tone", async () => {
    const user = userEvent.setup()
    const onSkinToneChange = vi.fn()
    await renderPicker({ skinTone: 2, onSkinToneChange })

    await user.click(screen.getByRole("radio", { name: "Dark" }))

    expect(onSkinToneChange).toHaveBeenCalledWith(5)
    expect(screen.getByRole("radio", { name: "Medium-light" })).toBeChecked()
  })

  it("uses defaultSkinTone until a tone is stored", async () => {
    await renderPicker({ defaultSkinTone: 4 })

    expect(screen.getByRole("radio", { name: "Medium-dark" })).toBeChecked()
  })

  it("remembers the skin tone and recent emoji on the next mount", async () => {
    const user = userEvent.setup()
    const { unmount } = await renderPicker()
    expect(screen.queryByText("Recently used")).not.toBeInTheDocument()

    await user.click(screen.getByRole("radio", { name: "Light" }))
    await user.click(emojiButton("waving hand"))
    unmount()
    await renderPicker()

    const recent = screen.getByRole("rowgroup", { name: "Recently used" })
    expect(
      within(recent).getByRole("button", { name: "waving hand" })
    ).toHaveTextContent("👋🏻")
    expect(screen.getByRole("radio", { name: "Light" })).toBeChecked()
  })

  it("does not reorder the grid while it is open", async () => {
    const user = userEvent.setup()
    await renderPicker()

    await user.click(emojiButton("waving hand"))

    expect(screen.queryByText("Recently used")).not.toBeInTheDocument()
  })

  it("hides category shortcuts from the keyboard and screen readers", async () => {
    await renderPicker()

    const shortcut = screen.getByTitle("Animals & nature")
    expect(shortcut).toHaveAttribute("tabindex", "-1")
    expect(shortcut.parentElement).toHaveAttribute("aria-hidden", "true")
  })

  it("forwards className and remaining props to the root", async () => {
    await renderPicker({ className: "w-full", "aria-label": "Reactions" })

    expect(screen.getByRole("group", { name: "Reactions" })).toHaveClass(
      "w-full"
    )
  })
})
