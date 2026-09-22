import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import {
  PasswordInput,
  PasswordStrength,
  scorePassword,
} from "@/registry/default/ui/password-input"

describe("PasswordInput", () => {
  it("toggles visibility with an accessible pressed button", async () => {
    const user = userEvent.setup()
    render(<PasswordInput aria-label="Password" defaultValue="hunter2" />)
    const input = screen.getByLabelText("Password")

    expect(input).toHaveAttribute("type", "password")
    await user.click(screen.getByRole("button", { name: "Show password" }))
    expect(input).toHaveAttribute("type", "text")
    expect(
      screen.getByRole("button", { name: "Hide password" })
    ).toHaveAttribute("aria-pressed", "true")
  })

  it("disables the toggle with the input", () => {
    render(<PasswordInput aria-label="Password" disabled />)
    expect(screen.getByRole("button", { name: "Show password" })).toBeDisabled()
  })
})

describe("scorePassword", () => {
  it("scores empty as 0 and grows with length and variety", () => {
    expect(scorePassword("")).toBe(0)
    expect(scorePassword("abc")).toBe(1)
    expect(scorePassword("copper-lantern")).toBe(2)
    expect(scorePassword("Copper-lantern9")).toBe(4)
  })
})

describe("PasswordStrength", () => {
  it("announces the label and exposes the score", () => {
    const { container } = render(<PasswordStrength value="copper-lantern" />)

    expect(screen.getByRole("status")).toHaveTextContent(
      "Password strength: Fair"
    )
    expect(container.firstElementChild).toHaveAttribute("data-score", "2")
  })

  it("stays silent for an empty value and accepts a custom scorer and labels", () => {
    const { rerender } = render(<PasswordStrength value="" />)
    expect(screen.getByRole("status")).toHaveTextContent(/^Password strength:$/)

    rerender(
      <PasswordStrength
        value="x"
        getScore={() => 3}
        labels={["0", "1", "2", "Solid", "4"]}
      />
    )
    expect(screen.getByRole("status")).toHaveTextContent("Solid")
  })
})
