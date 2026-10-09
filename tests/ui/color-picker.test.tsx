import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { ColorPicker } from "@/registry/default/ui/color-picker"

async function openPicker(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: /#/ }))
}

describe("ColorPicker", () => {
  it("shows the current color on the trigger", () => {
    render(<ColorPicker defaultValue="#6366f1" />)
    expect(screen.getByRole("button", { name: /#6366f1/ })).toBeInTheDocument()
  })

  it("commits a typed hex value on Enter and ignores invalid input", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<ColorPicker defaultValue="#6366f1" onValueChange={onValueChange} />)
    await openPicker(user)
    const hexInput = screen.getByRole("textbox", { name: "Hex color" })

    await user.clear(hexInput)
    await user.type(hexInput, "zzz{Enter}")
    expect(hexInput).toHaveAttribute("aria-invalid", "true")
    expect(onValueChange).not.toHaveBeenCalled()

    await user.clear(hexInput)
    await user.type(hexInput, "#10b981{Enter}")
    expect(onValueChange).toHaveBeenLastCalledWith("#10b981")
  })

  it("applies swatches and shows an oklch readout", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <ColorPicker
        defaultValue="#000000"
        swatches={["#ffffff"]}
        onValueChange={onValueChange}
      />
    )
    await openPicker(user)

    await user.click(screen.getByRole("button", { name: "Use #ffffff" }))

    expect(onValueChange).toHaveBeenLastCalledWith("#ffffff")
    expect(screen.getByText("oklch(1 0 0)")).toBeInTheDocument()
  })

  it("adjusts saturation and brightness from the keyboard", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<ColorPicker defaultValue="#808080" onValueChange={onValueChange} />)
    await openPicker(user)

    screen.getByRole("slider", { name: "Saturation and brightness" }).focus()
    await user.keyboard("{ArrowUp}")

    expect(onValueChange).toHaveBeenCalledOnce()
    expect(onValueChange.mock.lastCall?.[0]).not.toBe("#808080")
  })

  it("offers an opacity slider only when alpha is shown", async () => {
    const user = userEvent.setup()
    const { unmount } = render(<ColorPicker />)
    await openPicker(user)
    expect(screen.getByRole("slider", { name: "Opacity" })).toBeInTheDocument()
    unmount()

    render(<ColorPicker showAlpha={false} />)
    await openPicker(user)
    expect(screen.getByRole("slider", { name: "Hue" })).toBeInTheDocument()
    expect(screen.queryByRole("slider", { name: "Opacity" })).toBeNull()
  })
})
