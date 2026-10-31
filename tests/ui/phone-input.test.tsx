import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import * as React from "react"
import { describe, expect, it, vi } from "vitest"

import { PhoneInput } from "@/registry/default/ui/phone-input"

function field() {
  return screen.getByRole<HTMLInputElement>("textbox", { name: "Phone" })
}

function countryButton() {
  return screen.getByRole("button", { name: /^Country:/ })
}

async function openPicker(user: ReturnType<typeof userEvent.setup>) {
  await user.click(countryButton())
  return screen.findByRole("combobox", { name: "Search countries" })
}

describe("PhoneInput", () => {
  it("shows a controlled E.164 value in national format", () => {
    render(<PhoneInput aria-label="Phone" value="+14155550123" />)

    expect(field()).toHaveValue("(415) 555-0123")
    expect(countryButton()).toHaveAccessibleName("Country: United States, +1")
  })

  it("derives the country from the value over defaultCountry", () => {
    render(
      <PhoneInput
        aria-label="Phone"
        defaultValue="+442079460958"
        defaultCountry="US"
      />
    )

    expect(field()).toHaveValue("20 7946 0958")
    expect(countryButton()).toHaveAccessibleName("Country: United Kingdom, +44")
  })

  it("formats as you type and reports E.164", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <PhoneInput
        aria-label="Phone"
        defaultCountry="US"
        onValueChange={onValueChange}
      />
    )

    await user.type(field(), "4155550123")

    expect(field()).toHaveValue("(415) 555-0123")
    expect(onValueChange).toHaveBeenLastCalledWith("+14155550123")
  })

  it("keeps a controlled parent and the field in sync while typing", async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [phone, setPhone] = React.useState("")
      return (
        <>
          <PhoneInput
            aria-label="Phone"
            value={phone}
            onValueChange={setPhone}
          />
          <output>{phone}</output>
        </>
      )
    }
    render(<Controlled />)

    await user.type(field(), "02079460958")
    await user.clear(field())
    await user.type(field(), "+442079460958")

    expect(screen.getByRole("status")).toHaveTextContent("+442079460958")
    expect(countryButton()).toHaveAccessibleName("Country: United Kingdom, +44")
  })

  it("follows a value changed from outside", () => {
    const { rerender } = render(
      <PhoneInput aria-label="Phone" value="+14155550123" />
    )

    rerender(<PhoneInput aria-label="Phone" value="+442079460958" />)

    expect(field()).toHaveValue("20 7946 0958")
    expect(countryButton()).toHaveAccessibleName("Country: United Kingdom, +44")
  })

  it("reverts to the value when a controlled parent ignores the edit", async () => {
    const user = userEvent.setup()
    render(<PhoneInput aria-label="Phone" value="+14155550123" />)

    await user.type(field(), "9")

    expect(field()).toHaveValue("(415) 555-0123")
  })

  it("drops the dial code from a pasted international number", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<PhoneInput aria-label="Phone" onValueChange={onValueChange} />)

    await user.click(field())
    await user.paste("+917424855888")

    expect(field()).toHaveValue("74248 55888")
    expect(onValueChange).toHaveBeenLastCalledWith("+917424855888")
    expect(countryButton()).toHaveAccessibleName("Country: India, +91")
  })

  it("replaces a longer number when pasting over a selection", async () => {
    const user = userEvent.setup()
    render(<PhoneInput aria-label="Phone" defaultValue="+14155550123" />)

    await user.click(field())
    field().select()
    await user.paste("+917424855888")

    expect(field()).toHaveValue("74248 55888")
  })

  it("keeps the pasted country after the field is cleared", async () => {
    const user = userEvent.setup()
    render(<PhoneInput aria-label="Phone" />)

    await user.click(field())
    await user.paste("+917424855888")
    await user.clear(field())

    expect(field()).toHaveValue("")
    expect(countryButton()).toHaveAccessibleName("Country: India, +91")
  })

  it("keeps a typed + as typed", async () => {
    const user = userEvent.setup()
    render(<PhoneInput aria-label="Phone" />)

    await user.type(field(), "+917424855888")

    expect(field()).toHaveValue("+91 74248 55888")
  })

  it("keeps the caret on the same digit when editing mid-number", async () => {
    const user = userEvent.setup()
    render(<PhoneInput aria-label="Phone" defaultValue="+1415555012" />)

    await user.click(field())
    field().setSelectionRange(3, 3)
    await user.keyboard("9")

    expect(field()).toHaveValue("(419) 555-5012")
    expect(field().selectionStart).toBe(4)
  })

  it("keeps the caret in place when a typed letter is rejected", async () => {
    const user = userEvent.setup()
    render(<PhoneInput aria-label="Phone" defaultValue="+14155550123" />)

    await user.click(field())
    field().setSelectionRange(3, 3)
    await user.keyboard("x")

    expect(field()).toHaveValue("(415) 555-0123")
    expect(field().selectionStart).toBe(3)
  })

  it("clears the whole number with Backspace", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <PhoneInput
        aria-label="Phone"
        defaultValue="+14155550123"
        onValueChange={onValueChange}
      />
    )

    await user.click(field())
    await user.keyboard("{End}{Backspace>10/}")

    expect(field()).toHaveValue("")
    expect(onValueChange).toHaveBeenLastCalledWith("")
  })

  it("deletes forward across formatting", async () => {
    const user = userEvent.setup()
    render(<PhoneInput aria-label="Phone" defaultValue="+14155550123" />)

    await user.click(field())
    field().setSelectionRange(4, 4)
    await user.keyboard("{Delete}")

    expect(field()).toHaveValue("(415) 550-123")
  })

  it("picks a country by keyboard and keeps the national digits", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <PhoneInput
        aria-label="Phone"
        defaultValue="+14155550123"
        onValueChange={onValueChange}
      />
    )

    await openPicker(user)
    await user.keyboard("germany{Enter}")

    expect(onValueChange).toHaveBeenLastCalledWith("+494155550123")
    expect(countryButton()).toHaveAccessibleName("Country: Germany, +49")
    await waitFor(() =>
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
    )
  })

  it("wraps arrow keys through the filtered list", async () => {
    const user = userEvent.setup()
    render(<PhoneInput aria-label="Phone" />)

    const search = await openPicker(user)
    await user.keyboard("zam")
    const [zambia] = screen.getAllByRole("option")
    expect(search).toHaveAttribute("aria-activedescendant", zambia.id)

    await user.keyboard("{ArrowUp}")
    await user.keyboard("{ArrowDown}")
    expect(search).toHaveAttribute("aria-activedescendant", zambia.id)
  })

  it("starts on the selected country and marks it selected", async () => {
    const user = userEvent.setup()
    render(<PhoneInput aria-label="Phone" defaultCountry="DE" />)

    const search = await openPicker(user)
    const germany = screen.getByRole("option", { name: /Germany/ })

    expect(germany).toHaveAttribute("aria-selected", "true")
    expect(search).toHaveAttribute("aria-activedescendant", germany.id)
  })

  it("selects a country by click", async () => {
    const user = userEvent.setup()
    render(<PhoneInput aria-label="Phone" />)

    await openPicker(user)
    await user.click(screen.getByRole("option", { name: /France/ }))

    expect(countryButton()).toHaveAccessibleName("Country: France, +33")
  })

  it("scrolls the selected country into the list on open", async () => {
    const user = userEvent.setup()
    vi.spyOn(HTMLElement.prototype, "offsetTop", "get").mockReturnValue(3200)
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(32)
    vi.spyOn(Element.prototype, "clientHeight", "get").mockReturnValue(256)
    render(<PhoneInput aria-label="Phone" defaultCountry="DE" />)

    await openPicker(user)

    expect(screen.getByRole("listbox", { name: "Countries" }).scrollTop).toBe(
      2976
    )
    vi.restoreAllMocks()
  })

  it("does not submit the form when Enter picks a country", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <PhoneInput aria-label="Phone" />
      </form>
    )

    await openPicker(user)
    await user.keyboard("{Enter}")

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("says so when no country matches", async () => {
    const user = userEvent.setup()
    render(<PhoneInput aria-label="Phone" />)

    await openPicker(user)
    await user.keyboard("zzzz{Enter}")

    expect(screen.getByText("No results")).toBeInTheDocument()
  })

  it("closes the picker with Escape and returns focus to the button", async () => {
    const user = userEvent.setup()
    render(<PhoneInput aria-label="Phone" />)

    await openPicker(user)
    await user.keyboard("{Escape}")

    await waitFor(() => expect(countryButton()).toHaveFocus())
  })

  it("submits E.164 through a hidden input when named", () => {
    const { container } = render(
      <PhoneInput aria-label="Phone" name="phone" defaultValue="+14155550123" />
    )

    expect(container.querySelector("input[type=hidden]")).toHaveAttribute(
      "name",
      "phone"
    )
    expect(container.querySelector("input[type=hidden]")).toHaveValue(
      "+14155550123"
    )
    expect(field()).not.toHaveAttribute("name")
  })

  it("disables the field and the country button together", () => {
    render(<PhoneInput aria-label="Phone" disabled />)

    expect(field()).toBeDisabled()
    expect(countryButton()).toBeDisabled()
  })

  it("forwards input props and className", () => {
    const ref = React.createRef<HTMLInputElement>()
    const { container } = render(
      <PhoneInput
        ref={ref}
        aria-label="Phone"
        placeholder="Mobile"
        className="max-w-xs"
      />
    )

    expect(field()).toHaveAttribute("placeholder", "Mobile")
    expect(field()).toHaveAttribute("type", "tel")
    expect(field()).toHaveAttribute("autocomplete", "tel")
    expect(ref.current).toBe(field())
    expect(container.firstChild).toHaveClass("max-w-xs")
  })
})
