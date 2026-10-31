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

  it.each([
    ["Minutes", "90m", 5400000],
    ["Minutes", "75m", 4500000],
    ["Seconds", "90s", 90000],
    ["Minutes", "90s", 90000],
    ["Hours", "120h", 432000000],
    ["Minutes", "120m", 7200000],
    ["Hours", "1h30m", 5400000],
    ["Hours", "12h30m", 45000000],
  ] as const)(
    "from %s, typing %s commits the unit once",
    async (start, keys, expected) => {
      const user = userEvent.setup()
      const onValueChange = vi.fn()
      render(
        <DurationInput aria-label="Timeout" onValueChange={onValueChange} />
      )

      await user.click(segment(start))
      await user.keyboard(keys)

      expect(onValueChange).toHaveBeenLastCalledWith(expected)
    }
  )

  it("keeps earlier segments when digits are reassigned to another unit", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <DurationInput
        aria-label="Timeout"
        defaultValue={7200000}
        onValueChange={onValueChange}
      />
    )

    await user.click(segment("Hours"))
    await user.keyboard("5m")

    expect(onValueChange).toHaveBeenLastCalledWith(7500000)
    expect(segment("Minutes")).toHaveFocus()
  })

  it("ignores a unit key after the digits were stepped away from", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<DurationInput aria-label="Timeout" onValueChange={onValueChange} />)

    await user.click(segment("Minutes"))
    await user.keyboard("5{ArrowUp}s")

    expect(onValueChange).toHaveBeenLastCalledWith(360000)
    expect(segment("Seconds")).toHaveFocus()
  })

  it("does not let min leak into segments while digits are typed", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <DurationInput
        aria-label="Timeout"
        min={1800000}
        onValueChange={onValueChange}
      />
    )

    await user.click(segment("Hours"))
    await user.keyboard("02")

    expect(onValueChange).toHaveBeenLastCalledWith(7200000)
  })

  it("leaves modified keys to the browser", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <DurationInput
        aria-label="Timeout"
        defaultValue={3600000}
        onValueChange={onValueChange}
      />
    )

    await user.click(segment("Hours"))
    await user.keyboard("{Control>}s{/Control}{Meta>}1{/Meta}")

    expect(onValueChange).not.toHaveBeenCalled()
    expect(segment("Hours")).toHaveFocus()
  })

  it("reads a pasted bare number in the focused segment's unit", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<DurationInput aria-label="Timeout" onValueChange={onValueChange} />)

    await user.click(segment("Minutes"))
    await user.paste("90")

    expect(onValueChange).toHaveBeenLastCalledWith(5400000)
  })

  it("rounds pasted values to the smallest visible unit", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <DurationInput
        aria-label="Timeout"
        units={["h", "m"]}
        onValueChange={onValueChange}
      />
    )

    await user.click(segment("Hours"))
    await user.paste("20s")

    expect(onValueChange).toHaveBeenLastCalledWith(0)
  })

  it("keeps aria bounds consistent with the value", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <DurationInput
        aria-label="Timeout"
        defaultValue={4320000000}
        min={7200000}
        onValueChange={onValueChange}
      />
    )

    expect(segment("Hours")).toHaveAttribute("aria-valuemax", "1200")
    expect(segment("Hours")).toHaveAttribute("aria-valuemin", "2")

    await user.click(segment("Hours"))
    await user.keyboard("{End}")

    expect(onValueChange).not.toHaveBeenCalled()
    expect(segment("Hours")).toHaveAttribute("aria-valuenow", "1200")
  })

  it("announces a singular unit for a count of one", () => {
    render(<DurationInput aria-label="Timeout" defaultValue={3600000} />)

    expect(segment("Hours")).toHaveAttribute("aria-valuetext", "1 Hour")
    expect(segment("Minutes")).toHaveAttribute("aria-valuetext", "0 Minutes")
  })

  it("does not submit while disabled", () => {
    const { container } = render(
      <DurationInput
        aria-label="SLA"
        name="sla"
        defaultValue={3600000}
        disabled
      />
    )

    expect(container.querySelector("input[type=hidden]")).toBeDisabled()
  })

  it("drops the trailing margin when a hidden input follows the last unit", () => {
    const { container } = render(
      <DurationInput aria-label="SLA" name="sla" defaultValue={3600000} />
    )
    const unitMarks = container.querySelectorAll("[aria-hidden=true]")

    expect(unitMarks[0]).toHaveClass("mr-1.5")
    expect(unitMarks[unitMarks.length - 1]).not.toHaveClass("mr-1.5")
  })

  it("submits through a hidden input when name is provided", () => {
    const { container } = render(
      <DurationInput aria-label="SLA" name="sla" defaultValue={3600000} />
    )

    expect(container.querySelector("input[type=hidden]")).toHaveValue("3600000")
  })
})
