import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Rating } from "@/registry/default/ui/rating"

function checked() {
  return screen
    .getAllByRole("radio")
    .find((radio) => radio.getAttribute("aria-checked") === "true")
}

describe("Rating", () => {
  it("renders a radio group with one radio per step and one tab stop", () => {
    render(<Rating aria-label="Score" defaultValue={2} step={0.5} />)

    const radios = screen.getAllByRole("radio")
    expect(
      screen.getByRole("radiogroup", { name: "Score" })
    ).toBeInTheDocument()
    expect(radios).toHaveLength(10)
    expect(radios.filter((radio) => radio.tabIndex === 0)).toEqual([
      screen.getByRole("radio", { name: "2 out of 5" }),
    ])
  })

  it("sets the score on click", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Rating aria-label="Score" onValueChange={onValueChange} />)

    await user.click(screen.getByRole("radio", { name: "4 out of 5" }))

    expect(onValueChange).toHaveBeenCalledWith(4)
    expect(checked()).toHaveAccessibleName("4 out of 5")
  })

  it("moves by one step with arrow keys and jumps with Home and End", async () => {
    const user = userEvent.setup()
    render(<Rating aria-label="Score" defaultValue={3} step={0.5} />)

    await user.tab()
    expect(document.activeElement).toHaveAccessibleName("3 out of 5")

    await user.keyboard("{ArrowRight}")
    expect(checked()).toHaveAccessibleName("3.5 out of 5")
    expect(checked()).toHaveFocus()

    await user.keyboard("{ArrowLeft}{ArrowDown}")
    expect(checked()).toHaveAccessibleName("2.5 out of 5")

    await user.keyboard("{End}")
    expect(checked()).toHaveAccessibleName("5 out of 5")
    await user.keyboard("{ArrowRight}")
    expect(checked()).toHaveAccessibleName("5 out of 5")

    await user.keyboard("{Home}")
    expect(checked()).toHaveAccessibleName("0.5 out of 5")
  })

  it("follows a controlled value", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <Rating aria-label="Score" value={2} onValueChange={onValueChange} />
    )

    await user.click(screen.getByRole("radio", { name: "5 out of 5" }))

    expect(onValueChange).toHaveBeenCalledWith(5)
    expect(checked()).toHaveAccessibleName("2 out of 5")
  })

  it("renders read-only as a labelled image without radios", () => {
    render(<Rating aria-label="Average" value={3.5} readOnly />)

    expect(
      screen.getByRole("img", { name: "Average: 3.5 out of 5" })
    ).toBeInTheDocument()
    expect(screen.queryAllByRole("radio")).toHaveLength(0)
  })

  it("leaves the tab order when disabled", async () => {
    const user = userEvent.setup()
    render(<Rating aria-label="Score" disabled />)

    await user.tab()
    expect(document.body).toHaveFocus()
  })
})
