import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { MultiSelect } from "@/registry/default/ui/multi-select"

const OPTIONS = [
  { value: "eu-west-1", label: "Ireland", group: "Europe" },
  { value: "eu-central-1", label: "Frankfurt", group: "Europe" },
  { value: "us-east-1", label: "Virginia", group: "Americas" },
  { value: "ap-south-1", label: "Mumbai", group: "Asia Pacific" },
]

function combobox() {
  return screen.getByRole("combobox", { name: "Regions" })
}

function chipTexts() {
  return Array.from(
    document.querySelectorAll("[data-slot=multi-select-chip]")
  ).map((chip) => chip.textContent)
}

describe("MultiSelect", () => {
  it("opens a multiselectable listbox with grouped options on ArrowDown", async () => {
    const user = userEvent.setup()
    render(<MultiSelect aria-label="Regions" options={OPTIONS} />)

    await user.click(combobox())
    await user.keyboard("{Escape}")
    expect(combobox()).toHaveAttribute("aria-expanded", "false")

    await user.keyboard("{ArrowDown}")
    const listbox = screen.getByRole("listbox")
    expect(combobox()).toHaveAttribute("aria-expanded", "true")
    expect(combobox()).toHaveAttribute("aria-controls", listbox.id)
    expect(listbox).toHaveAttribute("aria-multiselectable", "true")
    expect(
      within(screen.getByRole("group", { name: "Europe" }))
        .getAllByRole("option")
        .map((option) => option.textContent)
    ).toEqual(["Ireland", "Frankfurt"])
  })

  it("filters as you type and toggles the highlighted option with Enter", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <MultiSelect
        aria-label="Regions"
        options={OPTIONS}
        onValueChange={onValueChange}
      />
    )

    await user.type(combobox(), "frank")
    expect(
      screen.getAllByRole("option").map((option) => option.textContent)
    ).toEqual(["Frankfurt"])
    expect(combobox()).toHaveAttribute(
      "aria-activedescendant",
      screen.getByRole("option").id
    )

    await user.keyboard("{Enter}")
    expect(onValueChange).toHaveBeenLastCalledWith(["eu-central-1"])
    expect(combobox()).toHaveValue("")
    expect(chipTexts()).toEqual(["Frankfurt"])
    expect(screen.getByRole("option", { name: "Frankfurt" })).toHaveAttribute(
      "aria-selected",
      "true"
    )

    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}")
    expect(onValueChange).toHaveBeenLastCalledWith([])
  })

  it("selects all and clears through the Select all option", async () => {
    const user = userEvent.setup()
    render(<MultiSelect aria-label="Regions" options={OPTIONS} />)

    await user.click(combobox())
    await user.click(screen.getByRole("option", { name: "Select all" }))
    expect(chipTexts()).toEqual(["Ireland", "Frankfurt", "Virginia", "Mumbai"])

    await user.keyboard("{Enter}")
    expect(chipTexts()).toEqual([])
  })

  it("clears the selection with the clear button", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <MultiSelect
        aria-label="Regions"
        options={OPTIONS}
        defaultValue={["eu-west-1", "us-east-1"]}
        onValueChange={onValueChange}
      />
    )

    await user.click(screen.getByRole("button", { name: "Clear selection" }))
    expect(onValueChange).toHaveBeenLastCalledWith([])
    expect(combobox()).toHaveFocus()
  })

  it("stops adding at maxSelected and hides Select all", async () => {
    const user = userEvent.setup()
    render(
      <MultiSelect
        aria-label="Regions"
        options={OPTIONS}
        defaultValue={["eu-west-1"]}
        maxSelected={1}
      />
    )

    await user.click(combobox())
    expect(screen.queryByRole("option", { name: "Select all" })).toBeNull()
    expect(screen.getByRole("option", { name: "Virginia" })).toHaveAttribute(
      "aria-disabled",
      "true"
    )

    await user.click(screen.getByRole("option", { name: "Virginia" }))
    expect(chipTexts()).toEqual(["Ireland"])
    expect(screen.getByRole("status")).toHaveTextContent("Limit of 1 reached")
  })

  it("collapses chips past maxVisibleChips into a count", () => {
    render(
      <MultiSelect
        aria-label="Regions"
        options={OPTIONS}
        defaultValue={["eu-west-1", "eu-central-1", "us-east-1", "ap-south-1"]}
        maxVisibleChips={2}
      />
    )

    expect(chipTexts()).toEqual(["Ireland", "Frankfurt"])
    expect(
      document.querySelector("[data-slot=multi-select-overflow]")
    ).toHaveTextContent("+2")
  })

  it("selects the last chip on Backspace and removes it on the second", async () => {
    const user = userEvent.setup()
    render(
      <MultiSelect
        aria-label="Regions"
        options={OPTIONS}
        defaultValue={["eu-west-1", "us-east-1"]}
      />
    )

    await user.click(combobox())
    await user.keyboard("{Backspace}")
    expect(document.querySelector("[data-active]")).toHaveTextContent(
      "Virginia"
    )
    expect(screen.getByRole("status")).toHaveTextContent(
      "Virginia selected, 2 of 2"
    )

    await user.keyboard("{ArrowLeft}{Backspace}")
    expect(chipTexts()).toEqual(["Virginia"])
  })

  it("works controlled", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <MultiSelect
        aria-label="Regions"
        options={OPTIONS}
        value={["eu-west-1"]}
        onValueChange={onValueChange}
      />
    )

    await user.click(screen.getByRole("button", { name: "Remove Ireland" }))
    expect(onValueChange).toHaveBeenCalledWith([])
    expect(chipTexts()).toEqual(["Ireland"])
  })
})
