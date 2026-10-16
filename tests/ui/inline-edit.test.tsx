import * as React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { InlineEdit } from "@/registry/default/ui/inline-edit"

function EditableName({
  onSave,
}: {
  onSave: (value: string) => void | Promise<void>
}) {
  const [name, setName] = React.useState("Billing migration")

  return (
    <InlineEdit
      aria-label="Project name"
      value={name}
      onSave={async (next) => {
        await onSave(next)
        setName(next)
      }}
    />
  )
}

function trigger() {
  return screen.getByRole("button", { name: "Edit Project name" })
}

describe("InlineEdit", () => {
  it("saves on Enter and returns focus to the trigger", async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<EditableName onSave={onSave} />)

    await user.click(trigger())
    const input = screen.getByRole("textbox", { name: "Project name" })
    expect(input).toHaveFocus()
    await user.clear(input)
    await user.type(input, "Ledger rewrite{Enter}")

    expect(onSave).toHaveBeenCalledWith("Ledger rewrite")
    await waitFor(() => expect(trigger()).toHaveTextContent("Ledger rewrite"))
    expect(trigger()).toHaveFocus()
  })

  it("discards the draft on Escape", async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<EditableName onSave={onSave} />)

    await user.click(trigger())
    await user.type(screen.getByRole("textbox"), " draft{Escape}")

    expect(onSave).not.toHaveBeenCalled()
    expect(trigger()).toHaveTextContent("Billing migration")
    expect(trigger()).toHaveFocus()
  })

  it("saves on blur and skips saving when nothing changed", async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<EditableName onSave={onSave} />)

    await user.click(trigger())
    await user.tab()
    expect(onSave).not.toHaveBeenCalled()

    await user.click(trigger())
    await user.type(screen.getByRole("textbox"), "!")
    await user.tab()
    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith("Billing migration!")
    )
  })

  it("stays open and marks the field invalid when saving fails", async () => {
    const user = userEvent.setup()
    render(<EditableName onSave={() => Promise.reject(new Error("offline"))} />)

    await user.click(trigger())
    await user.type(screen.getByRole("textbox"), "!{Enter}")

    await waitFor(() =>
      expect(screen.getByRole("textbox")).toHaveAttribute(
        "aria-invalid",
        "true"
      )
    )
    expect(screen.getByRole("textbox")).toHaveValue("Billing migration!")
  })

  it("shows the placeholder for an empty value and respects disabled", () => {
    render(
      <InlineEdit
        aria-label="Owner"
        value=""
        placeholder="Unassigned"
        onSave={() => {}}
        disabled
      />
    )

    const ownerTrigger = screen.getByRole("button", { name: "Edit Owner" })
    expect(ownerTrigger).toHaveTextContent("Unassigned")
    expect(ownerTrigger).toBeDisabled()
  })
})
