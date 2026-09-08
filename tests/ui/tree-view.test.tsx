import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { TreeView, type TreeNode } from "@/registry/default/ui/tree-view"

const ITEMS: TreeNode[] = [
  {
    id: "app",
    label: "app",
    children: [
      { id: "app/page", label: "page.tsx" },
      { id: "app/layout", label: "layout.tsx" },
    ],
  },
  { id: "archive", label: "archive", isBranch: true },
  { id: "package", label: "package.json" },
]

function focusedLabel() {
  return document.activeElement?.textContent
}

describe("TreeView", () => {
  it("renders a tree with levels, set positions and one tab stop", () => {
    render(
      <TreeView aria-label="Files" items={ITEMS} defaultExpanded={["app"]} />
    )

    const rows = screen.getAllByRole("treeitem")
    expect(screen.getByRole("tree", { name: "Files" })).toBeInTheDocument()
    expect(rows.map((row) => row.getAttribute("aria-level"))).toEqual([
      "1",
      "2",
      "2",
      "1",
      "1",
    ])
    expect(rows[1]).toHaveAttribute("aria-posinset", "1")
    expect(rows[1]).toHaveAttribute("aria-setsize", "2")
    expect(rows.filter((row) => row.tabIndex === 0)).toHaveLength(1)
  })

  it("expands with ArrowRight, enters children, and returns to the parent with ArrowLeft", async () => {
    const user = userEvent.setup()
    const onExpandedChange = vi.fn()
    render(
      <TreeView
        aria-label="Files"
        items={ITEMS}
        onExpandedChange={onExpandedChange}
      />
    )

    await user.tab()
    expect(focusedLabel()).toBe("app")

    await user.keyboard("{ArrowRight}")
    expect(onExpandedChange).toHaveBeenLastCalledWith(["app"])
    expect(screen.getByRole("treeitem", { name: "app" })).toHaveAttribute(
      "aria-expanded",
      "true"
    )

    await user.keyboard("{ArrowRight}")
    expect(focusedLabel()).toBe("page.tsx")

    await user.keyboard("{ArrowLeft}")
    expect(focusedLabel()).toBe("app")

    await user.keyboard("{ArrowLeft}")
    expect(screen.getByRole("treeitem", { name: "app" })).toHaveAttribute(
      "aria-expanded",
      "false"
    )
  })

  it("moves with ArrowDown, Home and End", async () => {
    const user = userEvent.setup()
    render(<TreeView aria-label="Files" items={ITEMS} />)

    await user.tab()
    await user.keyboard("{ArrowDown}")
    expect(focusedLabel()).toBe("archive")
    await user.keyboard("{End}")
    expect(focusedLabel()).toBe("package.json")
    await user.keyboard("{Home}")
    expect(focusedLabel()).toBe("app")
  })

  it("jumps by typeahead and keeps multi letter queries on the current match", async () => {
    const user = userEvent.setup()
    render(
      <TreeView aria-label="Files" items={ITEMS} defaultExpanded={["app"]} />
    )

    await user.tab()
    await user.keyboard("pa")
    expect(focusedLabel()).toBe("page.tsx")
  })

  it("selects with Enter and reports the selection", async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    render(
      <TreeView
        aria-label="Files"
        items={ITEMS}
        onSelectedChange={onSelectedChange}
      />
    )

    await user.tab()
    await user.keyboard("{End}{Enter}")

    expect(onSelectedChange).toHaveBeenCalledWith("package")
    expect(
      screen.getByRole("treeitem", { name: "package.json" })
    ).toHaveAttribute("aria-selected", "true")
  })

  it("shows a loading row for an expanded branch without children", () => {
    render(
      <TreeView
        aria-label="Files"
        items={ITEMS}
        defaultExpanded={["archive"]}
      />
    )
    expect(screen.getByText("Loading")).toBeInTheDocument()
  })
})
