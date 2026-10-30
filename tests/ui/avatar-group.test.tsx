import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import {
  AvatarGroup,
  AvatarGroupItem,
} from "@/registry/default/ui/avatar-group"

const PEOPLE = [
  "Ana Lima",
  "Kenji Sato",
  "Priya Nair",
  "Tomás Ruiz",
  "Lea Becker",
]

function renderGroup(max?: number) {
  return render(
    <AvatarGroup aria-label="Reviewers" max={max}>
      {PEOPLE.map((name, index) => (
        <AvatarGroupItem
          key={name}
          name={name}
          status={index === 0 ? "online" : undefined}
        />
      ))}
    </AvatarGroup>
  )
}

describe("AvatarGroup", () => {
  it("shows every avatar with initials and screen reader names", () => {
    renderGroup()

    const group = screen.getByRole("group", { name: "Reviewers" })
    expect(within(group).getByText("Ana Lima (online)")).toBeInTheDocument()
    expect(within(group).getByText("KS")).toBeInTheDocument()
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("collapses avatars past max into a +N button that lists them", async () => {
    const user = userEvent.setup()
    renderGroup(3)

    const overflow = screen.getByRole("button", { name: "2 more" })
    expect(overflow).toHaveTextContent("+2")
    expect(screen.queryByText("Lea Becker")).not.toBeInTheDocument()

    await user.tab()
    expect(overflow).toHaveFocus()
    await user.keyboard("{Enter}")

    expect(
      await screen.findByRole("dialog", { name: "2 more" })
    ).toBeInTheDocument()
    const list = await screen.findByRole("list")
    const items = within(list).getAllByRole("listitem")
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent("Tomás Ruiz")
    expect(items[1]).toHaveTextContent("Lea Becker")
  })
})
