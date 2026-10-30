import { act, fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import * as React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { VirtualList } from "@/registry/default/ui/virtual-list"

const VIEWPORT_HEIGHT = 100
const ROW_HEIGHT = 20

type Row = { id: string; name: string }

const ROWS: Row[] = Array.from({ length: 1000 }, (_, index) => ({
  id: `row-${index}`,
  name: `Row ${index}`,
}))

const observers = new Map<Element, ResizeObserverCallback>()

class ResizeObserverMock {
  constructor(private callback: ResizeObserverCallback) {}
  observe(target: Element) {
    observers.set(target, this.callback)
  }
  unobserve() {}
  disconnect() {}
}

function resizeRow(name: string, height: number) {
  const row = screen.getByText(name).closest('[role="listitem"]') as Element
  act(() => {
    observers.get(row)?.(
      [
        {
          target: row,
          borderBoxSize: [{ blockSize: height, inlineSize: 100 }],
        } as unknown as ResizeObserverEntry,
      ],
      {} as ResizeObserver
    )
  })
}

function renderList(rows = ROWS) {
  return render(
    <VirtualList
      aria-label="Rows"
      items={rows}
      estimateSize={ROW_HEIGHT}
      overscan={2}
      getItemKey={(row) => row.id}
    >
      {(row) => <div>{row.name}</div>}
    </VirtualList>
  )
}

function scrollTo(position: number) {
  const list = screen.getByRole("list", { name: "Rows" })
  fireEvent.scroll(list, { target: { scrollTop: position } })
}

function rowNames() {
  return screen.getAllByRole("listitem").map((row) => row.textContent)
}

describe("VirtualList", () => {
  beforeEach(() => {
    observers.clear()
    vi.stubGlobal("ResizeObserver", ResizeObserverMock)
    vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(
      VIEWPORT_HEIGHT
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it("mounts only the visible rows plus overscan", () => {
    renderList()

    const rows = screen.getAllByRole("listitem")
    expect(rows).toHaveLength(8)
    expect(rows[0]).toHaveAttribute("aria-posinset", "1")
    expect(rows[0]).toHaveAttribute("aria-setsize", "1000")
  })

  it("reserves the full scroll height from the estimate", () => {
    renderList()

    const list = screen.getByRole("list", { name: "Rows" })
    expect(list.firstElementChild).toHaveStyle({ height: "20000px" })
  })

  it("swaps rows as the list scrolls", () => {
    renderList()

    scrollTo(2000)

    expect(screen.queryByText("Row 0")).not.toBeInTheDocument()
    expect(rowNames()[0]).toBe("Row 98")
    expect(screen.getByText("Row 100").parentElement).toHaveStyle({
      transform: "translateY(2000px)",
    })
  })

  it("renders nothing for an empty list", () => {
    renderList([])

    expect(screen.queryByRole("listitem")).not.toBeInTheDocument()
  })

  it("keeps one tab stop, on a visible row", () => {
    renderList()

    scrollTo(2000)

    const tabbable = screen
      .getAllByRole("listitem")
      .filter((row) => row.tabIndex === 0)
    expect(tabbable.map((row) => row.textContent)).toEqual(["Row 100"])
  })

  it("keeps the focused row mounted after it scrolls out of the window", () => {
    renderList()
    const row = screen.getByText("Row 1").parentElement as HTMLElement
    act(() => row.focus())

    scrollTo(5000)

    expect(screen.getByText("Row 1").parentElement).toBe(row)
    expect(row).toHaveFocus()
    expect(rowNames()[0]).toBe("Row 1")
  })

  it("moves focus to rows that were not mounted yet", async () => {
    const user = userEvent.setup()
    renderList()
    const list = screen.getByRole("list", { name: "Rows" })

    await user.tab()
    expect(screen.getByText("Row 0").parentElement).toHaveFocus()

    await user.keyboard("{End}")
    expect(screen.getByText("Row 999").parentElement).toHaveFocus()
    expect(list.scrollTop).toBe(19900)

    fireEvent.scroll(list)
    await user.keyboard("{ArrowUp}")
    expect(screen.getByText("Row 998").parentElement).toHaveFocus()

    await user.keyboard("{Home}")
    expect(screen.getByText("Row 0").parentElement).toHaveFocus()
    expect(list.scrollTop).toBe(0)
  })

  it("pages through the list by the viewport height", async () => {
    const user = userEvent.setup()
    renderList()

    await user.tab()
    await user.keyboard("{PageDown}")

    expect(screen.getByText("Row 5").parentElement).toHaveFocus()
  })

  it("leaves keys alone inside interactive row content", async () => {
    const user = userEvent.setup()
    render(
      <VirtualList items={ROWS.slice(0, 3)} estimateSize={ROW_HEIGHT}>
        {(row) => <input aria-label={row.name} />}
      </VirtualList>
    )

    await user.click(screen.getByRole("textbox", { name: "Row 0" }))
    await user.keyboard("{ArrowDown}")

    expect(screen.getByRole("textbox", { name: "Row 0" })).toHaveFocus()
  })

  it("repositions rows from their measured heights", () => {
    renderList()

    resizeRow("Row 0", 50)

    const list = screen.getByRole("list", { name: "Rows" })
    expect(list.firstElementChild).toHaveStyle({ height: "20030px" })
    expect(screen.getByText("Row 1").parentElement).toHaveStyle({
      transform: "translateY(50px)",
    })
  })

  it("holds the scroll position when a row above the viewport grows", () => {
    renderList()
    scrollTo(100)

    resizeRow("Row 4", 50)

    expect(screen.getByRole("list", { name: "Rows" }).scrollTop).toBe(130)
  })

  it("holds a visible focused row in place when a row above it grows", async () => {
    const user = userEvent.setup()
    renderList()
    const list = screen.getByRole("list", { name: "Rows" })

    await user.tab()
    await user.keyboard("{End}")
    fireEvent.scroll(list)
    resizeRow("Row 997", 60)

    expect(list.scrollTop).toBe(19940)
  })

  it("keeps the focused row revealed once its height is known", async () => {
    const user = userEvent.setup()
    renderList()
    const list = screen.getByRole("list", { name: "Rows" })

    await user.tab()
    await user.keyboard("{End}")
    resizeRow("Row 999", 60)

    expect(list.scrollTop).toBe(19940)
  })

  it("follows the focused row when rows are inserted above it", () => {
    const { rerender } = renderList()
    const row = screen.getByText("Row 1").parentElement as HTMLElement
    act(() => row.focus())

    const inserted = { id: "new", name: "New row" }
    rerender(
      <VirtualList
        aria-label="Rows"
        items={[inserted, ...ROWS]}
        estimateSize={ROW_HEIGHT}
        overscan={2}
        getItemKey={(item) => item.id}
      >
        {(item) => <div>{item.name}</div>}
      </VirtualList>
    )

    expect(row).toHaveFocus()
    expect(row).toHaveAttribute("aria-posinset", "3")
  })

  it("forwards its ref, className and remaining props to the scroller", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <VirtualList
        ref={ref}
        items={ROWS}
        estimateSize={ROW_HEIGHT}
        className="h-96"
        data-testid="logs"
      >
        {(row) => row.name}
      </VirtualList>
    )

    expect(ref.current).toBe(screen.getByTestId("logs"))
    expect(ref.current).toHaveClass("h-96", "overflow-y-auto")
  })
})
