import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { JsonViewer } from "@/registry/default/ui/json-viewer"

const PAYLOAD = {
  id: "evt_1",
  paid: true,
  customer: { email: "ana@example.com", tax_id: null },
  lines: [{ amount: 4900 }],
}

function row(name: RegExp) {
  return screen.getByRole("treeitem", { name })
}

describe("JsonViewer", () => {
  it("renders a labelled tree opened to defaultExpandDepth", () => {
    render(<JsonViewer aria-label="Payload" data={PAYLOAD} />)

    const tree = screen.getByRole("tree", { name: "Payload" })
    expect(within(tree).getAllByRole("treeitem")).toHaveLength(7)
    expect(row(/^customer/)).toHaveAttribute("aria-expanded", "true")
    expect(row(/^email/)).toHaveTextContent('email:"ana@example.com"')
    expect(row(/^tax_id/)).toHaveTextContent("tax_id:null")
    expect(row(/^lines/)).toHaveTextContent("Array(1)")
  })

  it("expands and collapses from the keyboard", async () => {
    const user = userEvent.setup()
    render(<JsonViewer data={PAYLOAD} defaultExpandDepth={0} />)

    expect(screen.getAllByRole("treeitem")).toHaveLength(4)
    await user.click(screen.getByRole("searchbox"))
    await user.tab()
    await user.keyboard("{End}{ArrowRight}")

    expect(row(/^lines/)).toHaveAttribute("aria-expanded", "true")
    expect(row(/^0:/)).toBeInTheDocument()
  })

  it("copies the focused value and path with Ctrl+C and Ctrl+Shift+C", async () => {
    const user = userEvent.setup()
    const onCopy = vi.fn()
    render(<JsonViewer data={PAYLOAD} onCopy={onCopy} />)

    row(/^email/).focus()
    await user.keyboard("{Control>}c{/Control}")
    expect(await navigator.clipboard.readText()).toBe("ana@example.com")
    expect(onCopy).toHaveBeenLastCalledWith(
      "customer.email",
      "ana@example.com",
      "value"
    )

    await user.keyboard("{Control>}{Shift>}c{/Shift}{/Control}")
    expect(await navigator.clipboard.readText()).toBe("customer.email")
    expect(screen.getByText("Copied path")).toBeInTheDocument()
  })

  it("copies from the row buttons without toggling the row", async () => {
    const user = userEvent.setup()
    render(<JsonViewer data={PAYLOAD} />)

    await user.click(
      within(row(/^customer/)).getByRole("button", {
        name: "Copy value",
        hidden: true,
      })
    )

    expect(JSON.parse(await navigator.clipboard.readText())).toEqual(
      PAYLOAD.customer
    )
    expect(row(/^customer/)).toHaveAttribute("aria-expanded", "true")
  })

  it("highlights matches, counts them and opens their parents", async () => {
    const user = userEvent.setup()
    render(<JsonViewer data={PAYLOAD} defaultExpandDepth={0} />)

    await user.type(screen.getByRole("searchbox"), "4900")

    expect(screen.getByText("1 match")).toBeInTheDocument()
    expect(row(/^lines/)).toHaveAttribute("aria-expanded", "true")
    expect(row(/^amount/).querySelector("mark")).toHaveTextContent("4900")
  })

  it("opens only the current query's parents and restores them when cleared", async () => {
    const user = userEvent.setup()
    render(
      <JsonViewer
        data={{ one: { alpha: 1 }, two: { ana: 2 } }}
        defaultExpandDepth={0}
      />
    )
    const search = screen.getByRole("searchbox")

    await user.type(search, "a")
    expect(row(/^one/)).toHaveAttribute("aria-expanded", "true")
    expect(row(/^two/)).toHaveAttribute("aria-expanded", "true")

    await user.type(search, "n")
    expect(row(/^one/)).toHaveAttribute("aria-expanded", "false")
    expect(row(/^two/)).toHaveAttribute("aria-expanded", "true")

    await user.clear(search)
    expect(row(/^one/)).toHaveAttribute("aria-expanded", "false")
    expect(row(/^two/)).toHaveAttribute("aria-expanded", "false")
  })

  it("keeps row names free of the pointer-only copy buttons", () => {
    render(<JsonViewer data={PAYLOAD} />)

    expect(
      within(row(/^id:/)).queryByRole("button", { name: "Copy value" })
    ).not.toBeInTheDocument()
  })

  it("groups large arrays into ranges of 100", async () => {
    const user = userEvent.setup()
    render(
      <JsonViewer
        data={{ items: Array.from({ length: 250 }, (_, index) => index) }}
      />
    )

    expect(row(/^\[100 … 199\]/)).toHaveAttribute("aria-expanded", "false")
    expect(screen.getAllByRole("treeitem")).toHaveLength(4)

    await user.click(row(/^\[200 … 249\]/))
    expect(screen.getAllByRole("treeitem")).toHaveLength(54)
  })
})
