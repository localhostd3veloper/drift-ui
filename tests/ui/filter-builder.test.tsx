import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import type { FilterField } from "@/registry/default/lib/filter"
import { FilterBuilder } from "@/registry/default/ui/filter-builder"

const FIELDS: FilterField[] = [
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "open", label: "Open" },
      { value: "closed", label: "Closed" },
    ],
  },
  { id: "title", label: "Title", type: "text" },
]

function chipTexts() {
  return Array.from(document.querySelectorAll("[data-slot=filter-chip]")).map(
    (chip) => chip.textContent
  )
}

async function openAddMenu(user: ReturnType<typeof userEvent.setup>) {
  screen.getByRole("button", { name: "Add filter" }).focus()
  await user.keyboard("{Enter}")
}

describe("FilterBuilder", () => {
  it("adds a select filter and picks its value from the menu", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<FilterBuilder fields={FIELDS} onValueChange={onValueChange} />)

    await openAddMenu(user)
    await user.keyboard("{Enter}")
    expect(screen.getByRole("menuitem", { name: "Open" })).toBeInTheDocument()
    await user.keyboard("{ArrowDown}{Enter}")

    expect(chipTexts()).toEqual(["StatusisOpen"])
    expect(onValueChange.mock.lastCall?.[0]).toMatchObject([
      { fieldId: "status", operator: "is", value: "open" },
    ])
  })

  it("moves focus into the new text filter's input and commits on Enter", async () => {
    const user = userEvent.setup()
    render(<FilterBuilder fields={FIELDS} />)

    await openAddMenu(user)
    await user.keyboard("{ArrowDown}{Enter}")
    expect(screen.getByRole("textbox", { name: "Title value" })).toHaveFocus()

    await user.keyboard("billing{Enter}")
    expect(chipTexts()).toEqual(["Titlecontainsbilling"])
  })

  it("drops a new filter that was dismissed without a value", async () => {
    const user = userEvent.setup()
    render(<FilterBuilder fields={FIELDS} />)

    await openAddMenu(user)
    await user.keyboard("{Enter}")
    await user.keyboard("{Escape}")

    expect(chipTexts()).toEqual([])
  })

  it("removes one filter or clears them all", async () => {
    const user = userEvent.setup()
    render(
      <FilterBuilder
        fields={FIELDS}
        defaultValue={[
          { id: "a", fieldId: "status", operator: "is", value: "open" },
          { id: "b", fieldId: "title", operator: "contains", value: "invoice" },
        ]}
      />
    )

    await user.click(
      screen.getByRole("button", { name: "Remove Status filter" })
    )
    expect(chipTexts()).toEqual(["Titlecontainsinvoice"])

    await user.click(screen.getByRole("button", { name: "Clear" }))
    expect(chipTexts()).toEqual([])
    expect(screen.queryByRole("button", { name: "Clear" })).toBeNull()
  })

  it("changes the operator from the chip", async () => {
    const user = userEvent.setup()
    render(
      <FilterBuilder
        fields={FIELDS}
        defaultValue={[
          { id: "a", fieldId: "title", operator: "contains", value: "invoice" },
        ]}
      />
    )

    screen.getByRole("button", { name: "Title operator" }).focus()
    await user.keyboard("{Enter}")
    await user.click(screen.getByRole("menuitem", { name: "is not" }))

    expect(chipTexts()).toEqual(["Titleis notinvoice"])
  })
})
