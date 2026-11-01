import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { CurrencyInput, MaskedInput } from "@/registry/default/ui/masked-input"

describe("MaskedInput", () => {
  it("formats characters as user types into the mask", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <MaskedInput
        aria-label="Credit card"
        mask="#### #### #### ####"
        onValueChange={onValueChange}
      />
    )

    const input = screen.getByRole("textbox", { name: "Credit card" })
    await user.type(input, "12345678")

    expect(input).toHaveValue("1234 5678 ")
    expect(onValueChange).toHaveBeenLastCalledWith("12345678", "1234 5678 ")
  })

  it("handles backspace over mask delimiters", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <MaskedInput
        aria-label="Phone"
        mask="(###) ###-####"
        defaultValue="123"
        onValueChange={onValueChange}
      />
    )

    const input = screen.getByRole("textbox", { name: "Phone" })
    expect(input).toHaveValue("(123) ")

    // Cursor is at end (after ") "). Backspace should delete '3'
    await user.type(input, "{Backspace}")
    expect(input).toHaveValue("(12")
    expect(onValueChange).toHaveBeenLastCalledWith("12", "(12")
  })

  it("supports controlled value updates", () => {
    const { rerender } = render(
      <MaskedInput aria-label="License" mask="AA-####-AA" value="AB12" />
    )

    const input = screen.getByRole("textbox", { name: "License" })
    expect(input).toHaveValue("AB-12")

    rerender(
      <MaskedInput aria-label="License" mask="AA-####-AA" value="AB1234CD" />
    )
    expect(input).toHaveValue("AB-1234-CD")
  })

  it("submits raw value via hidden input when name is provided", () => {
    const { container } = render(
      <MaskedInput
        aria-label="Card"
        mask="#### ####"
        name="card"
        defaultValue="12345678"
      />
    )

    expect(container.querySelector("input[type=hidden]")).toHaveValue(
      "12345678"
    )
  })

  it("respects disabled attribute", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <MaskedInput
        aria-label="Disabled"
        mask="####"
        disabled
        onValueChange={onValueChange}
      />
    )

    const input = screen.getByRole("textbox", { name: "Disabled" })
    expect(input).toBeDisabled()
    await user.type(input, "1234")
    expect(onValueChange).not.toHaveBeenCalled()
  })
})

describe("CurrencyInput", () => {
  it("formats input as localized currency and emits cents", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <CurrencyInput
        aria-label="Amount"
        currency="USD"
        locale="en-US"
        onValueChange={onValueChange}
      />
    )

    const input = screen.getByRole("textbox", { name: "Amount" })
    await user.type(input, "12.50")

    expect(input).toHaveValue("$12.50")
    expect(onValueChange).toHaveBeenLastCalledWith(1250, "$12.50")
  })

  it("handles EUR currency with German locale separators", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <CurrencyInput
        aria-label="Betrag"
        currency="EUR"
        locale="de-DE"
        defaultValue={125050}
        onValueChange={onValueChange}
      />
    )

    const input = screen.getByRole("textbox", { name: "Betrag" })
    expect(input.getAttribute("value")?.replace(/\u00a0/g, " ")).toBe(
      "1.250,50 €"
    )

    await user.clear(input)
    await user.type(input, "25,00")
    expect(onValueChange).toHaveBeenLastCalledWith(
      2500,
      expect.stringContaining("25,00")
    )
  })

  it("clamps to min and max boundaries", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <CurrencyInput
        aria-label="Budget"
        currency="USD"
        locale="en-US"
        min={1000} // $10.00
        max={5000} // $50.00
        onValueChange={onValueChange}
      />
    )

    const input = screen.getByRole("textbox", { name: "Budget" })
    await user.type(input, "99.00")

    // Clamped to max 5000 cents ($50.00)
    expect(onValueChange).toHaveBeenLastCalledWith(5000, "$50.00")

    await user.clear(input)
    await user.type(input, "5.00")
    expect(onValueChange).toHaveBeenLastCalledWith(500, "$5.00")

    await user.tab()
    expect(onValueChange).toHaveBeenLastCalledWith(1000, "$10.00")
    expect(input).toHaveValue("$10.00")
  })

  it("submits cents via hidden input when name is provided", () => {
    const { container } = render(
      <CurrencyInput aria-label="Price" name="price" defaultValue={1999} />
    )

    expect(container.querySelector("input[type=hidden]")).toHaveValue("1999")
  })
})
