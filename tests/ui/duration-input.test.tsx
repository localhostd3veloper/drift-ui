import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { DurationInput } from "@/registry/default/ui/duration-input"

function segment(name: "Hours" | "Minutes" | "Seconds" | "Days") {
  return screen.getByRole("spinbutton", { name })
}

describe("DurationInput", () => {
  it("types digits across segments, advancing when a segment is complete", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <DurationInput
        aria-label="Timeout"
        units={["h", "m", "s"]}
        onValueChange={onValueChange}
      />
    )

    await user.click(segment("Hours"))
    await user.keyboard("0230")

    // 02 in hours (7200000) then 30 in minutes (1800000) = 9000000 ms
    expect(onValueChange).toHaveBeenLastCalledWith(9000000)
    expect(segment("Minutes")).toHaveTextContent("30")
    expect(segment("Seconds")).toHaveFocus()
  })

  it("handles roll-over when entering 90 minutes (90m becomes 1h 30m)", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <DurationInput
        aria-label="Estimate"
        units={["h", "m", "s"]}
        onValueChange={onValueChange}
      />
    )

    await user.click(segment("Minutes"))
    await user.keyboard("90")

    // 90 minutes = 5400000 ms = 1h 30m
    expect(onValueChange).toHaveBeenLastCalledWith(5400000)
    expect(segment("Hours")).toHaveTextContent("01")
    expect(segment("Minutes")).toHaveTextContent("30")
  })

  it("steps with ArrowUp and ArrowDown, rolling over to higher units", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    // 59 minutes = 3540000 ms
    render(
      <DurationInput
        aria-label="SLA"
        defaultValue={3540000}
        units={["h", "m", "s"]}
        onValueChange={onValueChange}
      />
    )

    await user.click(segment("Minutes"))
    await user.keyboard("{ArrowUp}")

    // 59m + 1m = 1h 00m = 3600000 ms
    expect(onValueChange).toHaveBeenLastCalledWith(3600000)
    expect(segment("Hours")).toHaveTextContent("01")
    expect(segment("Minutes")).toHaveTextContent("00")
  })

  it("handles unit shorthand navigation and typed shorthand", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <DurationInput
        aria-label="Build timeout"
        units={["h", "m", "s"]}
        onValueChange={onValueChange}
      />
    )

    // Focusing anywhere and typing unit key jumps focus
    await user.click(segment("Hours"))
    await user.keyboard("m")
    expect(segment("Minutes")).toHaveFocus()

    // Typing digits then unit key assigns to that unit
    await user.keyboard("45s")
    expect(onValueChange).toHaveBeenLastCalledWith(45000)
    expect(segment("Seconds")).toHaveFocus()
    expect(segment("Seconds")).toHaveTextContent("45")
  })

  it("handles paste of shorthand duration strings", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <DurationInput
        aria-label="Video length"
        units={["h", "m", "s"]}
        onValueChange={onValueChange}
      />
    )

    await user.click(segment("Hours"))
    await user.paste("1h 30m")

    expect(onValueChange).toHaveBeenLastCalledWith(5400000)
    expect(segment("Hours")).toHaveTextContent("01")
    expect(segment("Minutes")).toHaveTextContent("30")
  })

  it("clears with Backspace and shows placeholders when empty", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <DurationInput
        aria-label="Timeout"
        defaultValue={5400000}
        units={["h", "m", "s"]}
        onValueChange={onValueChange}
      />
    )

    await user.click(segment("Hours"))
    await user.keyboard("{Backspace}")

    expect(onValueChange).toHaveBeenLastCalledWith(null)
    expect(segment("Hours")).toHaveTextContent("--")
    expect(segment("Hours")).toHaveAttribute("aria-valuetext", "Empty")
  })

  it("supports custom units such as days and hours", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    // 2d 4h = 2 * 86400000 + 4 * 3600000 = 187200000 ms
    render(
      <DurationInput
        aria-label="Maintenance"
        defaultValue={187200000}
        units={["d", "h"]}
        onValueChange={onValueChange}
      />
    )

    expect(segment("Days")).toHaveTextContent("2")
    expect(segment("Hours")).toHaveTextContent("04")

    await user.click(segment("Days"))
    await user.keyboard("{ArrowUp}")
    // 3d 4h = 3 * 86400000 + 4 * 3600000 = 273600000 ms
    expect(onValueChange).toHaveBeenLastCalledWith(273600000)
  })

  it("respects disabled state", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <DurationInput
        aria-label="Disabled"
        disabled
        defaultValue={3600000}
        onValueChange={onValueChange}
      />
    )

    expect(segment("Hours")).toHaveAttribute("tabindex", "-1")
    await user.click(segment("Hours"))
    await user.keyboard("{ArrowUp}")
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("submits through a hidden input when name is provided", () => {
    const { container } = render(
      <DurationInput aria-label="SLA" name="sla" defaultValue={3600000} />
    )

    expect(container.querySelector("input[type=hidden]")).toHaveValue("3600000")
  })
})
