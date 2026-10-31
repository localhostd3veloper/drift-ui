import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { TransferList } from "@/registry/default/ui/transfer-list"

const USERS = [
  { id: "1", label: "Alice", description: "Engineer" },
  { id: "2", label: "Bob", description: "Designer" },
  { id: "3", label: "Charlie", description: "Product Manager" },
  { id: "4", label: "Diana", description: "Security", disabled: true },
]

describe("TransferList", () => {
  it("renders both panels with titles and initial counts", () => {
    render(
      <TransferList
        items={USERS}
        defaultValue={["3"]}
        titles={["Available", "Assigned"]}
      />
    )

    expect(screen.getByText("Available")).toBeInTheDocument()
    expect(screen.getByText("Assigned")).toBeInTheDocument()

    expect(screen.getByText("0 / 3")).toBeInTheDocument()
    expect(screen.getByText("0 / 1")).toBeInTheDocument()
  })

  it("selects and moves an item from Available to Assigned", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <TransferList
        items={USERS}
        defaultValue={[]}
        onValueChange={onValueChange}
        titles={["Available", "Assigned"]}
      />
    )

    const aliceOption = screen.getByRole("option", { name: /Alice/i })
    await user.click(aliceOption)
    expect(aliceOption).toHaveAttribute("aria-selected", "true")

    const moveRightBtn = screen.getByRole("button", {
      name: "Move selected to Assigned",
    })
    expect(moveRightBtn).toBeEnabled()
    await user.click(moveRightBtn)

    expect(onValueChange).toHaveBeenCalledWith(["1"])
  })

  it("selects and moves an item from Assigned to Available", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <TransferList
        items={USERS}
        defaultValue={["1", "2"]}
        onValueChange={onValueChange}
        titles={["Available", "Assigned"]}
      />
    )

    const bobOption = screen.getByRole("option", { name: /Bob/i })
    await user.click(bobOption)

    const moveLeftBtn = screen.getByRole("button", {
      name: "Move selected to Available",
    })
    await user.click(moveLeftBtn)

    expect(onValueChange).toHaveBeenCalledWith(["1"])
  })

  it("moves all non-disabled items to Assigned on Move All click", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <TransferList
        items={USERS}
        defaultValue={[]}
        onValueChange={onValueChange}
        titles={["Available", "Assigned"]}
      />
    )

    const moveAllRightBtn = screen.getByRole("button", {
      name: "Move all to Assigned",
    })
    await user.click(moveAllRightBtn)

    expect(onValueChange).toHaveBeenCalledWith(["1", "2", "3"])
  })

  it("filters items when searchable is true", async () => {
    const user = userEvent.setup()

    render(
      <TransferList
        items={USERS}
        defaultValue={[]}
        searchable
        titles={["Available", "Assigned"]}
      />
    )

    const searchInput = screen.getByPlaceholderText("Search available...")
    await user.type(searchInput, "Alice")

    expect(screen.getByText("Alice")).toBeInTheDocument()
    expect(screen.queryByText("Bob")).not.toBeInTheDocument()

    const clearBtn = screen.getByRole("button", {
      name: "Clear search Available",
    })
    await user.click(clearBtn)
    expect(screen.getByText("Bob")).toBeInTheDocument()
  })

  it("transfers item immediately on double click", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <TransferList
        items={USERS}
        defaultValue={[]}
        onValueChange={onValueChange}
        titles={["Available", "Assigned"]}
      />
    )

    const aliceOption = screen.getByRole("option", { name: /Alice/i })
    await user.dblClick(aliceOption)

    expect(onValueChange).toHaveBeenCalledWith(["1"])
  })

  it("toggles item selection with Space key", async () => {
    const user = userEvent.setup()

    render(
      <TransferList
        items={USERS}
        defaultValue={[]}
        titles={["Available", "Assigned"]}
      />
    )

    const aliceOption = screen.getByRole("option", { name: /Alice/i })
    aliceOption.focus()
    await user.keyboard(" ")
    expect(aliceOption).toHaveAttribute("aria-selected", "true")

    await user.keyboard(" ")
    expect(aliceOption).toHaveAttribute("aria-selected", "false")
  })

  it("does not select or move disabled items", async () => {
    const user = userEvent.setup()

    render(
      <TransferList
        items={USERS}
        defaultValue={[]}
        titles={["Available", "Assigned"]}
      />
    )

    const dianaOption = screen.getByRole("option", { name: /Diana/i })
    await user.click(dianaOption)
    expect(dianaOption).toHaveAttribute("aria-selected", "false")
  })

  it("gives each listbox one tab stop and moves focus with arrow keys", async () => {
    const user = userEvent.setup()
    render(<TransferList items={USERS} defaultValue={["3"]} />)

    const available = screen.getAllByRole("listbox")[0]
    const tabStops = within(available)
      .getAllByRole("option")
      .filter((option) => option.tabIndex === 0)
    expect(tabStops).toHaveLength(1)

    screen.getByRole("option", { name: /Alice/ }).focus()
    await user.keyboard("{ArrowDown}")
    expect(screen.getByRole("option", { name: /Bob/ })).toHaveFocus()
    expect(screen.getByRole("option", { name: /Bob/ })).toHaveAttribute(
      "tabindex",
      "0"
    )

    await user.keyboard("{Home}")
    expect(screen.getByRole("option", { name: /Alice/ })).toHaveFocus()
    await user.keyboard("{End}")
    expect(screen.getByRole("option", { name: /Bob/ })).toHaveFocus()
  })

  it("extends the selection with Shift and arrow keys", async () => {
    const user = userEvent.setup()
    render(<TransferList items={USERS} />)

    screen.getByRole("option", { name: /Alice/ }).focus()
    await user.keyboard("{Shift>}{ArrowDown}{/Shift}")

    expect(screen.getByRole("option", { name: /Alice/ })).toHaveAttribute(
      "aria-selected",
      "true"
    )
    expect(screen.getByRole("option", { name: /Bob/ })).toHaveAttribute(
      "aria-selected",
      "true"
    )
  })

  it("skips disabled items in a Shift-click range", async () => {
    const user = userEvent.setup()
    const items = [...USERS, { id: "5", label: "Eve" }]
    render(<TransferList items={items} />)

    await user.click(screen.getByRole("option", { name: /Charlie/ }))
    await user.keyboard("{Shift>}")
    await user.click(screen.getByRole("option", { name: /Eve/ }))
    await user.keyboard("{/Shift}")

    expect(screen.getByRole("option", { name: /Diana/ })).toHaveAttribute(
      "aria-selected",
      "false"
    )
    expect(screen.getByRole("option", { name: /Eve/ })).toHaveAttribute(
      "aria-selected",
      "true"
    )
  })

  it("selects on Shift-click after the anchor item has moved away", async () => {
    const user = userEvent.setup()
    render(<TransferList items={USERS} />)

    await user.dblClick(screen.getByRole("option", { name: /Alice/ }))
    await user.keyboard("{Shift>}")
    await user.click(screen.getByRole("option", { name: /Bob/ }))
    await user.keyboard("{/Shift}")

    expect(screen.getByRole("option", { name: /Bob/ })).toHaveAttribute(
      "aria-selected",
      "true"
    )
  })

  it("limits move all to the items the search leaves visible", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <TransferList
        items={USERS}
        searchable
        onValueChange={onValueChange}
        titles={["Available", "Assigned"]}
      />
    )

    await user.type(screen.getByLabelText("Search Available"), "Bob")
    await user.click(
      screen.getByRole("button", { name: "Move all to Assigned" })
    )

    expect(onValueChange).toHaveBeenCalledWith(["2"])
  })

  it("does not move checked items hidden by the search", async () => {
    const user = userEvent.setup()
    render(
      <TransferList
        items={USERS}
        searchable
        titles={["Available", "Assigned"]}
      />
    )

    await user.click(screen.getByRole("option", { name: /Alice/ }))
    await user.type(screen.getByLabelText("Search Available"), "Bob")

    expect(
      screen.getByRole("button", { name: "Move selected to Assigned" })
    ).toBeDisabled()
  })

  it("keeps ids outside items when moving everything back", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <TransferList
        items={USERS}
        defaultValue={["1", "not-loaded"]}
        onValueChange={onValueChange}
        titles={["Available", "Assigned"]}
      />
    )

    await user.click(
      screen.getByRole("button", { name: "Move all to Available" })
    )

    expect(onValueChange).toHaveBeenCalledWith(["not-loaded"])
  })

  it("exposes disabled items and select-all state to assistive tech", async () => {
    const user = userEvent.setup()
    render(<TransferList items={USERS} titles={["Available", "Assigned"]} />)

    expect(screen.getByRole("option", { name: /Diana/ })).toHaveAttribute(
      "aria-disabled",
      "true"
    )

    const selectAll = screen.getByRole("checkbox", {
      name: "Select all Available",
    })
    expect(selectAll).toHaveAttribute("aria-checked", "false")
    await user.click(screen.getByRole("option", { name: /Alice/ }))
    expect(selectAll).toHaveAttribute("aria-checked", "mixed")
  })

  it("announces moved items by name", async () => {
    const user = userEvent.setup()
    render(<TransferList items={USERS} titles={["Available", "Assigned"]} />)

    await user.dblClick(screen.getByRole("option", { name: /Alice/ }))

    expect(screen.getByRole("status")).toHaveTextContent(
      "Moved Alice to Assigned."
    )
  })

  it("does not submit a surrounding form on Enter in search", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <TransferList
          items={USERS}
          searchable
          titles={["Available", "Assigned"]}
        />
        <button type="submit">Save</button>
      </form>
    )

    await user.type(screen.getByLabelText("Search Available"), "Bob{Enter}")

    expect(onSubmit).not.toHaveBeenCalled()
  })
})
