import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  BulkActionBar,
  BulkActionBarButton,
} from "@/registry/default/ui/bulk-action-bar"

function TestBar({
  selectedCount,
  onClear,
}: {
  selectedCount: number
  onClear: () => void
}) {
  return (
    <BulkActionBar
      placement="container"
      selectedCount={selectedCount}
      onClear={onClear}
    >
      <BulkActionBarButton>Move</BulkActionBarButton>
      <BulkActionBarButton variant="destructive">Delete</BulkActionBarButton>
    </BulkActionBar>
  )
}

describe("BulkActionBar", () => {
  it("stays hidden with nothing selected", () => {
    render(<TestBar selectedCount={0} onClear={() => {}} />)
    expect(screen.queryByRole("toolbar")).toBeNull()
  })

  it("appears as a labelled toolbar with the count and actions", () => {
    render(<TestBar selectedCount={3} onClear={() => {}} />)

    const toolbar = screen.getByRole("toolbar", { name: "Bulk actions" })
    expect(toolbar).toHaveTextContent("3 selected")
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument()
  })

  it("clears with the clear button and with Escape", async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    render(<TestBar selectedCount={2} onClear={onClear} />)

    await user.click(screen.getByRole("button", { name: "Clear selection" }))
    await user.keyboard("{Escape}")

    expect(onClear).toHaveBeenCalledTimes(2)
  })

  it("ignores Escape while hidden and leaves when the selection empties", async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    const { rerender } = render(<TestBar selectedCount={0} onClear={onClear} />)

    await user.keyboard("{Escape}")
    expect(onClear).not.toHaveBeenCalled()

    rerender(<TestBar selectedCount={1} onClear={onClear} />)
    expect(screen.getByRole("toolbar")).toBeInTheDocument()
    rerender(<TestBar selectedCount={0} onClear={onClear} />)
    await waitFor(() => expect(screen.queryByRole("toolbar")).toBeNull())
  })

  it("moves between actions with the arrow keys", async () => {
    const user = userEvent.setup()
    render(<TestBar selectedCount={2} onClear={() => {}} />)

    screen.getByRole("button", { name: "Move" }).focus()
    await user.keyboard("{ArrowRight}")

    expect(screen.getByRole("button", { name: "Delete" })).toHaveFocus()
  })
})
