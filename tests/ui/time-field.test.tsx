import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { TimeField } from "@/registry/default/ui/time-field"

function segment(name: "Hours" | "Minutes" | "AM/PM") {
  return screen.getByRole("spinbutton", { name })
}

describe("TimeField", () => {
  it("types digits across segments, advancing when a segment is complete", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<TimeField aria-label="Standup" onValueChange={onValueChange} />)

    await user.click(segment("Hours"))
    await user.keyboard("0930")

    expect(onValueChange).toHaveBeenLastCalledWith("09:30")
    expect(segment("Minutes")).toHaveFocus()
  })

  it("advances right away when the first digit cannot start a two digit hour", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<TimeField aria-label="Standup" onValueChange={onValueChange} />)

    await user.click(segment("Hours"))
    await user.keyboard("7")

    expect(onValueChange).toHaveBeenLastCalledWith("07:00")
    expect(segment("Minutes")).toHaveFocus()
  })

  it("steps and wraps with the arrow keys and respects minuteStep", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <TimeField
        aria-label="Standup"
        defaultValue="23:50"
        minuteStep={15}
        onValueChange={onValueChange}
      />
    )

    await user.click(segment("Hours"))
    await user.keyboard("{ArrowUp}")
    expect(onValueChange).toHaveBeenLastCalledWith("00:50")

    await user.keyboard("{ArrowRight}{ArrowUp}")
    expect(onValueChange).toHaveBeenLastCalledWith("00:05")
  })

  it("shows AM/PM on a 12 hour cycle and switches with p and a", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <TimeField
        aria-label="Deploy window"
        defaultValue="09:30"
        hourCycle={12}
        onValueChange={onValueChange}
      />
    )

    expect(segment("AM/PM")).toHaveTextContent("AM")
    await user.click(segment("AM/PM"))
    await user.keyboard("p")

    expect(onValueChange).toHaveBeenLastCalledWith("21:30")
    expect(segment("Hours")).toHaveAttribute("aria-valuenow", "9")
  })

  it("clears with Backspace and shows placeholders when empty", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <TimeField
        aria-label="Standup"
        defaultValue="09:30"
        onValueChange={onValueChange}
      />
    )

    await user.click(segment("Minutes"))
    await user.keyboard("{Backspace}")

    expect(onValueChange).toHaveBeenLastCalledWith("")
    expect(segment("Hours")).toHaveTextContent("--")
    expect(segment("Hours")).toHaveAttribute("aria-valuetext", "Empty")
  })

  it("exposes a named group and submits through a hidden input", () => {
    const { container } = render(
      <TimeField aria-label="Standup" name="standup" defaultValue="08:15" />
    )

    expect(screen.getByRole("group", { name: "Standup" })).toBeInTheDocument()
    expect(container.querySelector("input[type=hidden]")).toHaveValue("08:15")
  })
})
