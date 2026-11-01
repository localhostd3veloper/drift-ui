import * as React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  DescriptionItem,
  DescriptionList,
} from "@/registry/default/ui/description-list"

function UserDetails({ onRename }: { onRename: (value: string) => void }) {
  const [owner, setOwner] = React.useState("Ana")

  return (
    <DescriptionList>
      <DescriptionItem label="ID" copyable>
        <code>usr_8f2a</code>
      </DescriptionItem>
      <DescriptionItem
        label="Owner"
        editable
        onValueChange={(next) => {
          onRename(next)
          setOwner(next)
        }}
      >
        {owner}
      </DescriptionItem>
    </DescriptionList>
  )
}

describe("DescriptionList", () => {
  it("renders terms and definitions in a description list", () => {
    render(<UserDetails onRename={() => {}} />)

    expect(screen.getAllByRole("term").map((term) => term.textContent)).toEqual(
      ["ID", "Owner"]
    )
    expect(screen.getAllByRole("definition")[0]).toHaveTextContent("usr_8f2a")
  })

  it("copies the value text and announces it", async () => {
    const user = userEvent.setup()
    render(<UserDetails onRename={() => {}} />)

    await user.click(screen.getByRole("button", { name: "Copy ID" }))

    expect(await navigator.clipboard.readText()).toBe("usr_8f2a")
    expect(screen.getByRole("status")).toHaveTextContent("Copied")
  })

  it("edits a row in place from the keyboard", async () => {
    const user = userEvent.setup()
    const onRename = vi.fn()
    render(<UserDetails onRename={onRename} />)

    await user.click(screen.getByRole("button", { name: /^Edit Owner:/ }))
    const input = screen.getByRole("textbox", { name: "Owner" })
    await user.clear(input)
    await user.type(input, "Kenji{Enter}")

    expect(onRename).toHaveBeenCalledWith("Kenji")
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /^Edit Owner:/ })).toHaveFocus()
    )
    expect(screen.getAllByRole("definition")[1]).toHaveTextContent("Kenji")
  })
})
