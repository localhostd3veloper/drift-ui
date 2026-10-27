import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { TagsInput } from "@/registry/default/ui/tags-input"

function tagTexts() {
  return Array.from(
    document.querySelectorAll("[data-slot=tags-input-tag]")
  ).map((tag) => tag.textContent)
}

describe("TagsInput", () => {
  it("adds tags with Enter and comma, trimming whitespace", async () => {
    const user = userEvent.setup()
    render(<TagsInput aria-label="Tags" />)

    await user.type(screen.getByLabelText("Tags"), "  canary {Enter}staging,")

    expect(tagTexts()).toEqual(["canary", "staging"])
    expect(screen.getByLabelText("Tags")).toHaveValue("")
    expect(screen.getByRole("status")).toHaveTextContent("Added staging")
  })

  it("skips duplicates unless allowed", async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <TagsInput aria-label="Tags" defaultValue={["billing"]} />
    )
    await user.type(screen.getByLabelText("Tags"), "billing{Enter}")
    expect(tagTexts()).toEqual(["billing"])

    rerender(
      <TagsInput aria-label="Tags" defaultValue={["billing"]} allowDuplicates />
    )
    await user.type(screen.getByLabelText("Tags"), "{Enter}")
    expect(tagTexts()).toEqual(["billing", "billing"])
  })

  it("selects the last tag on the first Backspace and removes it on the second", async () => {
    const user = userEvent.setup()
    render(<TagsInput aria-label="Tags" defaultValue={["billing", "canary"]} />)
    const input = screen.getByLabelText("Tags")

    await user.click(input)
    await user.keyboard("{Backspace}")
    expect(document.querySelector("[data-active]")).toHaveTextContent("canary")

    await user.keyboard("{Backspace}")
    expect(tagTexts()).toEqual(["billing"])
    expect(input).toHaveFocus()
  })

  it("moves the selection with the arrow keys", async () => {
    const user = userEvent.setup()
    render(<TagsInput aria-label="Tags" defaultValue={["a", "b", "c"]} />)

    await user.click(screen.getByLabelText("Tags"))
    await user.keyboard("{ArrowLeft}{ArrowLeft}")
    expect(document.querySelector("[data-active]")).toHaveTextContent("b")

    await user.keyboard("{ArrowRight}{ArrowRight}")
    expect(document.querySelector("[data-active]")).toBeNull()
  })

  it("splits pasted lists on commas and newlines", async () => {
    const user = userEvent.setup()
    render(<TagsInput aria-label="Tags" />)

    await user.click(screen.getByLabelText("Tags"))
    await user.paste("one, two\nthree")

    expect(tagTexts()).toEqual(["one", "two", "three"])
  })

  it("keeps a rejected draft in the field so it can be corrected", async () => {
    const user = userEvent.setup()
    render(
      <TagsInput aria-label="Tags" validate={(tag) => tag.includes("@")} />
    )
    const input = screen.getByLabelText("Tags")

    await user.type(input, "nope{Enter}")

    expect(tagTexts()).toEqual([])
    expect(input).toHaveValue("nope")
  })

  it("blocks adding once max tags are reached but keeps keyboard removal", async () => {
    const user = userEvent.setup()
    render(<TagsInput aria-label="Tags" max={2} />)
    const input = screen.getByLabelText("Tags")

    await user.type(input, "a{Enter}b{Enter}")

    expect(tagTexts()).toEqual(["a", "b"])
    expect(input).toBeEnabled()
    expect(input).toHaveAttribute("readonly")
    expect(input).toHaveFocus()
    expect(screen.getByRole("status")).toHaveTextContent("Limit of 2 reached")

    await user.keyboard("c{Enter}")
    expect(tagTexts()).toEqual(["a", "b"])

    await user.keyboard("{Backspace}{Backspace}")
    expect(tagTexts()).toEqual(["a"])
    expect(input).not.toHaveAttribute("readonly")
  })

  it("announces the selected tag", async () => {
    const user = userEvent.setup()
    render(<TagsInput aria-label="Tags" defaultValue={["design", "billing"]} />)

    await user.click(screen.getByLabelText("Tags"))
    await user.keyboard("{ArrowLeft}{ArrowLeft}")

    expect(screen.getByRole("status")).toHaveTextContent(
      "design selected, 1 of 2. Press Backspace to remove"
    )
  })

  it("moves into the tags with ArrowLeft when the caret is at the start of a draft", async () => {
    const user = userEvent.setup()
    render(<TagsInput aria-label="Tags" defaultValue={["a", "b"]} />)
    const input = screen.getByLabelText("Tags")

    await user.type(input, "draft{Home}")
    await user.keyboard("{ArrowLeft}")

    expect(document.querySelector("[data-active]")).toHaveTextContent("b")
    expect(input).toHaveValue("draft")
  })

  it("reports changes and removes tags with the remove button", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <TagsInput
        aria-label="Tags"
        value={["billing", "canary"]}
        onValueChange={onValueChange}
      />
    )

    await user.click(screen.getByRole("button", { name: "Remove billing" }))

    expect(onValueChange).toHaveBeenCalledWith(["canary"])
    expect(tagTexts()).toEqual(["billing", "canary"])
  })
})
