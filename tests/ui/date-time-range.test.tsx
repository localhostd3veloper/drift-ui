import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { DateTimeRangePicker } from "@/registry/default/ui/date-time-range"

const MARCH_10 = new Date(2026, 2, 10, 8, 30)

function dayButton(day: number) {
  return screen.getByRole("button", {
    name: new RegExp(`March ${day}(st|nd|rd|th), 2026`),
  })
}

describe("DateTimeRangePicker", () => {
  it("shows the placeholder until a range is picked", () => {
    render(<DateTimeRangePicker placeholder="Pick a window" />)
    expect(
      screen.getByRole("button", { name: /Pick a window/ })
    ).toHaveAttribute("data-empty")
  })

  it("completes a range and keeps the start time while defaulting the end to 17:00", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <DateTimeRangePicker
        numberOfMonths={1}
        defaultValue={{ from: MARCH_10 }}
        onValueChange={onValueChange}
      />
    )

    await user.click(screen.getByRole("button", { name: /Mar 10, 2026/ }))
    await user.click(dayButton(13))

    const range = onValueChange.mock.lastCall?.[0]
    expect(range.from).toEqual(new Date(2026, 2, 10, 8, 30))
    expect(range.to).toEqual(new Date(2026, 2, 13, 17, 0))
  })

  it("edits the start and end times", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <DateTimeRangePicker
        numberOfMonths={1}
        defaultValue={{ from: MARCH_10, to: new Date(2026, 2, 12, 17, 0) }}
        onValueChange={onValueChange}
      />
    )

    await user.click(screen.getByRole("button", { name: /Mar 10, 2026/ }))
    fireEvent.change(screen.getByLabelText("Start time"), {
      target: { value: "07:15" },
    })

    expect(onValueChange.mock.lastCall?.[0].from).toEqual(
      new Date(2026, 2, 10, 7, 15)
    )
  })

  it("disables time fields until their date is chosen and clears the range", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <DateTimeRangePicker
        numberOfMonths={1}
        defaultValue={{ from: MARCH_10 }}
        onValueChange={onValueChange}
      />
    )

    await user.click(screen.getByRole("button", { name: /Mar 10, 2026/ }))
    expect(screen.getByLabelText("Start time")).toBeEnabled()
    expect(screen.getByLabelText("End time")).toBeDisabled()

    await user.click(screen.getByRole("button", { name: "Clear" }))
    expect(onValueChange).toHaveBeenLastCalledWith({})
  })

  it("closes the popover with Done", async () => {
    const user = userEvent.setup()
    render(<DateTimeRangePicker numberOfMonths={1} />)

    await user.click(screen.getByRole("button", { name: /Pick a date range/ }))
    expect(screen.getByRole("dialog")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Done" }))
    expect(screen.queryByRole("dialog")).toBeNull()
  })
})
