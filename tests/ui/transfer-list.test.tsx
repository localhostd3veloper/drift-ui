import { render, screen } from "@testing-library/react"
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

    // Available has 1, 2, 4 (3 items)
    expect(screen.getByText("0 / 3")).toBeInTheDocument()
    // Assigned has 3 (1 item)
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

    // Click Alice (option in Available)
    const aliceOption = screen.getByRole("option", { name: /Alice/i })
    await user.click(aliceOption)
    expect(aliceOption).toHaveAttribute("aria-selected", "true")

    // Click move to Assigned button
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

    // Click Bob in Assigned
    const bobOption = screen.getByRole("option", { name: /Bob/i })
    await user.click(bobOption)

    // Click move to Available button
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

    // Non-disabled: 1, 2, 3 (4 is disabled)
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

    // Clear search
    const clearBtn = screen.getByRole("button", { name: "Clear search" })
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
})
