import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { PhoneInputFormPreview } from "@/components/preview/examples/phone-input/form"

describe("PhoneInput examples", () => {
  it("submits E.164 in the form example", async () => {
    const user = userEvent.setup()
    render(<PhoneInputFormPreview />)

    await user.click(screen.getByRole("button", { name: "Save" }))

    expect(screen.getByText("phone=+919876543210")).toBeInTheDocument()
  })
})
