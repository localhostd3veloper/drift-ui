import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { MentionTextarea } from "@/registry/default/ui/mention-textarea"

const TRIGGERS = {
  "@": [
    { value: "noor", label: "Noor Haddad", description: "Platform" },
    { value: "tomasz", label: "Tomasz Wierzba" },
  ],
  "#": [{ value: "ops", label: "ops" }],
}

function textarea() {
  return screen.getByRole("combobox", { name: "Comment" })
}

describe("MentionTextarea", () => {
  it("opens filtered suggestions after a trigger character", async () => {
    const user = userEvent.setup()
    render(<MentionTextarea aria-label="Comment" triggers={TRIGGERS} />)

    await user.type(textarea(), "Thanks @wier")

    expect(textarea()).toHaveAttribute("aria-expanded", "true")
    expect(
      screen.getAllByRole("option").map((option) => option.textContent)
    ).toEqual(["Tomasz Wierzba"])
    expect(textarea()).toHaveAttribute(
      "aria-activedescendant",
      screen.getByRole("option").id
    )
  })

  it("inserts the highlighted option with Enter after moving with the arrows", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <MentionTextarea
        aria-label="Comment"
        triggers={TRIGGERS}
        onValueChange={onValueChange}
      />
    )

    await user.type(textarea(), "cc @")
    await user.keyboard("{ArrowDown}{Enter}")

    expect(textarea()).toHaveValue("cc @tomasz ")
    expect(onValueChange).toHaveBeenLastCalledWith("cc @tomasz ")
    expect(textarea()).toHaveAttribute("aria-expanded", "false")
  })

  it("supports several triggers and inserts on click", async () => {
    const user = userEvent.setup()
    render(<MentionTextarea aria-label="Comment" triggers={TRIGGERS} />)

    await user.type(textarea(), "post in #")
    await user.click(screen.getByRole("option", { name: "ops" }))

    expect(textarea()).toHaveValue("post in #ops ")
  })

  it("dismisses suggestions with Escape and keeps the typed text", async () => {
    const user = userEvent.setup()
    render(<MentionTextarea aria-label="Comment" triggers={TRIGGERS} />)

    await user.type(textarea(), "@no")
    await user.keyboard("{Escape}")

    expect(textarea()).toHaveAttribute("aria-expanded", "false")
    expect(textarea()).toHaveValue("@no")
  })

  it("lets Enter add a newline when no suggestions are open", async () => {
    const user = userEvent.setup()
    render(<MentionTextarea aria-label="Comment" triggers={TRIGGERS} />)

    await user.type(textarea(), "line one{Enter}line two")

    expect(textarea()).toHaveValue("line one\nline two")
  })
})
