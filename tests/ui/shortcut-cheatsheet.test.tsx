import * as React from "react"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { ShortcutCheatsheetPreview } from "@/components/preview/shortcut-cheatsheet-preview"
import { ShortcutCheatsheet } from "@/registry/default/ui/shortcut-cheatsheet"

const pathname = vi.hoisted(() => ({ current: "" }))

vi.mock("next/navigation", () => ({
  usePathname: () => pathname.current,
}))

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

function searchField() {
  return screen.getByRole("searchbox", { name: "Search shortcuts" })
}

describe("ShortcutCheatsheet", () => {
  it("opens on ? with focus in the search field and lists every section", async () => {
    const user = userEvent.setup()
    render(<ShortcutCheatsheet sections={SECTIONS} />)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    await user.keyboard("?")

    expect(
      screen.getByRole("dialog", { name: "Keyboard shortcuts" })
    ).toBeInTheDocument()
    await waitFor(() => expect(searchField()).toHaveFocus())
    expect(
      screen.getByRole("heading", { name: "Navigation" })
    ).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Editing" })).toBeInTheDocument()
    expect(screen.getByRole("status")).toHaveTextContent("3 shortcuts")
  })

  it("formats keys with the same labels as the recorder", () => {
    render(<ShortcutCheatsheet sections={SECTIONS} defaultOpen />)

    const row = screen.getByText("Search", { selector: "dt" }).parentElement
    expect(
      Array.from(row?.querySelectorAll("kbd") ?? []).map(
        (key) => key.textContent
      )
    ).toEqual(["Ctrl", "K"])
  })

  it("does not open while the user is typing in a field", async () => {
    const user = userEvent.setup()
    render(
      <>
        <input aria-label="Notes" />
        <ShortcutCheatsheet sections={SECTIONS} />
      </>
    )

    await user.type(screen.getByRole("textbox", { name: "Notes" }), "?")

    expect(screen.getByRole("textbox", { name: "Notes" })).toHaveValue("?")
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("opens on a recorded shortcut and ignores the default", async () => {
    const user = userEvent.setup()
    render(<ShortcutCheatsheet sections={SECTIONS} trigger="Mod+/" />)

    await user.keyboard("?")
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    await user.keyboard("{Control>}/{/Control}")
    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })

  it("stays closed with an empty trigger", async () => {
    const user = userEvent.setup()
    render(<ShortcutCheatsheet sections={SECTIONS} trigger="" />)

    await user.keyboard("?")

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("narrows the list as the user searches and reports an empty result", async () => {
    const user = userEvent.setup()
    render(<ShortcutCheatsheet sections={SECTIONS} defaultOpen />)

    await user.type(searchField(), "inbox")
    expect(screen.getByText("Go to inbox")).toBeInTheDocument()
    expect(screen.queryByText("Send message")).not.toBeInTheDocument()
    expect(
      screen.queryByRole("heading", { name: "Editing" })
    ).not.toBeInTheDocument()
    expect(screen.getByRole("status")).toHaveTextContent("1 shortcut")

    await user.type(searchField(), "zzz")
    expect(screen.getByRole("status")).toHaveTextContent("No shortcuts found")
  })

  it("closes on Escape and clears the search for the next open", async () => {
    const user = userEvent.setup()
    render(<ShortcutCheatsheet sections={SECTIONS} />)

    await user.keyboard("?")
    await waitFor(() => expect(searchField()).toHaveFocus())
    await user.type(searchField(), "inbox")
    await user.keyboard("{Escape}")
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    )

    await user.keyboard("?")
    await waitFor(() => expect(searchField()).toHaveFocus())
    expect(searchField()).toHaveValue("")
  })

  it("returns focus to the control that opened it", async () => {
    const user = userEvent.setup()
    function Help() {
      const [open, setOpen] = React.useState(false)
      return (
        <>
          <button onClick={() => setOpen(true)}>Help</button>
          <ShortcutCheatsheet
            sections={SECTIONS}
            open={open}
            onOpenChange={setOpen}
          />
        </>
      )
    }
    render(<Help />)
    const opener = screen.getByRole("button", { name: "Help" })

    await user.click(opener)
    await waitFor(() => expect(searchField()).toHaveFocus())
    await user.keyboard("{Escape}")

    await waitFor(() => expect(opener).toHaveFocus())
  })

  it("returns focus without scrolling the page", async () => {
    const user = userEvent.setup()
    render(
      <>
        <button>Help</button>
        <ShortcutCheatsheet sections={SECTIONS} />
      </>
    )
    const opener = screen.getByRole("button", { name: "Help" })
    opener.focus()
    const focus = vi.spyOn(opener, "focus")

    await user.keyboard("?")
    await waitFor(() => expect(searchField()).toHaveFocus())
    await user.keyboard("{Escape}")

    await waitFor(() => expect(opener).toHaveFocus())
    expect(focus).toHaveBeenCalled()
    for (const [options] of focus.mock.calls)
      expect(options).toMatchObject({ preventScroll: true })
  })

  it("lets the caller pick the focus target when the opener unmounts", async () => {
    const user = userEvent.setup()
    function Menu() {
      const [open, setOpen] = React.useState(false)
      const [isMenuOpen, setIsMenuOpen] = React.useState(true)
      const menuButton = React.useRef<HTMLButtonElement>(null)
      const returnFocus =
        process.env.UI_PRIMITIVES === "base"
          ? { finalFocus: menuButton }
          : {
              onCloseAutoFocus: (event: Event) => {
                event.preventDefault()
                menuButton.current?.focus()
              },
            }
      return (
        <>
          <button ref={menuButton}>Menu</button>
          {isMenuOpen && (
            <button
              onClick={() => {
                setOpen(true)
                setTimeout(() => setIsMenuOpen(false))
              }}
            >
              Keyboard shortcuts
            </button>
          )}
          <ShortcutCheatsheet
            sections={SECTIONS}
            open={open}
            onOpenChange={setOpen}
            {...returnFocus}
          />
        </>
      )
    }
    render(<Menu />)

    await user.click(screen.getByRole("button", { name: "Keyboard shortcuts" }))
    await waitFor(() => expect(searchField()).toHaveFocus())
    await user.keyboard("{Escape}")

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Menu" })).toHaveFocus()
    )
  })

  it("drops a key still held from opening, but keeps typed repeats", () => {
    render(<ShortcutCheatsheet sections={SECTIONS} defaultOpen />)

    expect(fireEvent.keyDown(searchField(), { key: "?", repeat: true })).toBe(
      false
    )

    fireEvent.change(searchField(), { target: { value: "i" } })
    expect(fireEvent.keyDown(searchField(), { key: "i", repeat: true })).toBe(
      true
    )
  })

  it("renders shortcuts that share a label or a section title", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {})
    render(
      <ShortcutCheatsheet
        defaultOpen
        sections={[
          {
            title: "Navigation",
            shortcuts: [
              { keys: "Mod+K", label: "Search" },
              { keys: "/", label: "Search" },
            ],
          },
          {
            title: "Navigation",
            shortcuts: [{ keys: "G", label: "Go to inbox" }],
          },
        ]}
      />
    )

    expect(screen.getAllByText("Search")).toHaveLength(2)
    expect(error).not.toHaveBeenCalled()
    error.mockRestore()
  })

  it("lets the parent control open", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const { rerender } = render(
      <ShortcutCheatsheet
        sections={SECTIONS}
        open={false}
        onOpenChange={onOpenChange}
      />
    )

    await user.keyboard("?")
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    rerender(
      <ShortcutCheatsheet
        sections={SECTIONS}
        open
        onOpenChange={onOpenChange}
      />
    )
    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })

  it("lets the keyboard reach the scrollable list", async () => {
    const user = userEvent.setup()
    render(<ShortcutCheatsheet sections={SECTIONS} defaultOpen />)
    await waitFor(() => expect(searchField()).toHaveFocus())

    await user.tab()

    expect(screen.getByRole("region", { name: "Shortcuts" })).toHaveFocus()
  })

  it("passes className and remaining props to the dialog", () => {
    render(
      <ShortcutCheatsheet
        sections={SECTIONS}
        defaultOpen
        className="custom"
        data-testid="cheatsheet"
      />
    )

    expect(screen.getByTestId("cheatsheet")).toHaveClass("custom")
    expect(screen.getByRole("dialog")).toHaveAttribute(
      "data-slot",
      "shortcut-cheatsheet"
    )
  })
})

describe("ShortcutCheatsheetPreview", () => {
  it("opens on ? on its docs page", async () => {
    pathname.current = "/components/radix/shortcut-cheatsheet"
    const user = userEvent.setup()
    render(<ShortcutCheatsheetPreview />)

    await user.keyboard("?")

    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })

  it.each(["/components", "/themes"])(
    "leaves ? alone as a thumbnail on %s",
    async (path) => {
      pathname.current = path
      const user = userEvent.setup()
      render(<ShortcutCheatsheetPreview />)

      await user.keyboard("?")

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
      expect(screen.queryByText("Or press")).not.toBeInTheDocument()
    }
  )
})
