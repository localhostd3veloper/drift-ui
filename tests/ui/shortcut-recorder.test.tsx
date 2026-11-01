import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  ShortcutKeys,
  ShortcutRecorder,
} from "@/registry/default/ui/shortcut-recorder"

function recorder() {
  return screen.getByRole("button", { name: /shortcut/i })
}

describe("ShortcutRecorder", () => {
  it("records a modifier combination as a portable shortcut", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <ShortcutRecorder
        aria-label="Command shortcut"
        onValueChange={onValueChange}
      />
    )

    await user.click(recorder())
    expect(recorder()).toHaveAttribute("aria-pressed", "true")
    await user.keyboard("{Control>}{Shift>}k{/Shift}{/Control}")

    expect(onValueChange).toHaveBeenCalledWith("Mod+Shift+K")
    expect(recorder()).toHaveAttribute("aria-pressed", "false")
    expect(
      Array.from(recorder().querySelectorAll("kbd")).map(
        (key) => key.textContent
      )
    ).toEqual(["Ctrl", "Shift", "K"])
  })

  it("ignores plain keys when a modifier is required but accepts function keys", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <ShortcutRecorder
        aria-label="Command shortcut"
        onValueChange={onValueChange}
      />
    )

    await user.click(recorder())
    await user.keyboard("k")
    expect(onValueChange).not.toHaveBeenCalled()
    expect(recorder()).toHaveAttribute("aria-pressed", "true")

    await user.keyboard("{F5}")
    expect(onValueChange).toHaveBeenCalledWith("F5")
  })

  it("cancels with Escape and clears with Backspace", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <ShortcutRecorder
        aria-label="Command shortcut"
        defaultValue="Mod+K"
        onValueChange={onValueChange}
      />
    )

    await user.click(recorder())
    await user.keyboard("{Escape}")
    expect(onValueChange).not.toHaveBeenCalled()
    expect(recorder()).toHaveAttribute("aria-pressed", "false")

    await user.click(recorder())
    await user.keyboard("{Backspace}")
    expect(onValueChange).toHaveBeenCalledWith("")
  })

  it("keeps the recorded keys in the labelled button's accessible name", () => {
    render(<ShortcutRecorder aria-label="Command shortcut" value="Mod+K" />)

    expect(recorder()).toHaveAccessibleName(/^Command shortcut: .*K/)
  })

  it("stops recording when focus leaves", async () => {
    const user = userEvent.setup()
    render(<ShortcutRecorder aria-label="Command shortcut" />)

    await user.click(recorder())
    await user.tab()

    expect(recorder()).toHaveAttribute("aria-pressed", "false")
    expect(recorder()).not.toHaveFocus()
  })

  it("still records Tab when combined with a modifier", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <ShortcutRecorder
        aria-label="Command shortcut"
        onValueChange={onValueChange}
      />
    )

    await user.click(recorder())
    await user.keyboard("{Control>}{Tab}{/Control}")

    expect(onValueChange).toHaveBeenCalledWith("Mod+Tab")
  })
})

describe("ShortcutKeys", () => {
  it("renders each part as a kbd element", () => {
    const { container } = render(<ShortcutKeys shortcut="Mod+Shift+P" />)
    expect(
      Array.from(container.querySelectorAll("kbd")).map(
        (key) => key.textContent
      )
    ).toEqual(["Ctrl", "Shift", "P"])
  })
})
