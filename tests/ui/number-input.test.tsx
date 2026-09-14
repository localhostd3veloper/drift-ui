import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { NumberInput } from "@/registry/default/ui/number-input"

function spinbutton() {
  return screen.getByRole("spinbutton")
}

describe("NumberInput", () => {
  it("steps with the arrow keys, Shift and PageUp", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <NumberInput
        aria-label="Replicas"
        defaultValue={3}
        onValueChange={onValueChange}
      />
    )

    await user.click(spinbutton())
    await user.keyboard("{ArrowUp}")
    expect(spinbutton()).toHaveValue("4")
    await user.keyboard("{Shift>}{ArrowDown}{/Shift}")
    expect(spinbutton()).toHaveValue("-6")
    await user.keyboard("{PageUp}")
    expect(spinbutton()).toHaveValue("4")
    expect(onValueChange).toHaveBeenLastCalledWith(4)
  })

  it("clamps to min and max, jumps with Home and End, and disables the step buttons at the bounds", async () => {
    const user = userEvent.setup()
    render(
      <NumberInput aria-label="Replicas" defaultValue={11} min={1} max={12} />
    )

    await user.click(spinbutton())
    await user.keyboard("{Shift>}{ArrowUp}{/Shift}")
    expect(spinbutton()).toHaveValue("12")
    expect(spinbutton()).toHaveAttribute("aria-valuenow", "12")
    expect(screen.getByRole("button", { name: "Increase" })).toBeDisabled()

    await user.keyboard("{Home}")
    expect(spinbutton()).toHaveValue("1")
    expect(screen.getByRole("button", { name: "Decrease" })).toBeDisabled()

    await user.keyboard("{End}")
    expect(spinbutton()).toHaveValue("12")
  })

  it("parses typed values with the locale's separators without rounding to the step", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <NumberInput
        aria-label="Budget"
        defaultValue={1240.5}
        step={10}
        locale="de-DE"
        formatOptions={{ style: "currency", currency: "EUR" }}
        onValueChange={onValueChange}
      />
    )

    await user.tripleClick(spinbutton())
    await user.keyboard("2.399,75{Enter}")

    expect(onValueChange).toHaveBeenLastCalledWith(2399.75)
    expect(spinbutton()).toHaveValue(
      new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(2399.75)
    )
  })

  it("avoids floating point drift when stepping decimals", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <NumberInput
        aria-label="Ratio"
        defaultValue={0.1}
        step={0.2}
        onValueChange={onValueChange}
      />
    )

    await user.click(spinbutton())
    await user.keyboard("{ArrowUp}")

    expect(onValueChange).toHaveBeenLastCalledWith(0.3)
  })

  it("commits on blur and clears to null for empty input", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <NumberInput
        aria-label="Seats"
        defaultValue={5}
        onValueChange={onValueChange}
      />
    )

    await user.tripleClick(spinbutton())
    await user.keyboard("{Backspace}")
    await user.tab()

    expect(onValueChange).toHaveBeenLastCalledWith(null)
    expect(spinbutton()).toHaveValue("")
  })

  it("steps with the buttons and submits the raw number through name", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <NumberInput
        aria-label="Seats"
        name="seats"
        defaultValue={1000}
        locale="en-US"
      />
    )

    await user.click(screen.getByRole("button", { name: "Increase" }))

    expect(spinbutton()).toHaveValue("1,001")
    expect(container.querySelector("input[type=hidden]")).toHaveValue("1001")
  })
})
