import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { SignaturePad } from "@/registry/default/ui/signature-pad"

const SAVED = '<svg xmlns="http://www.w3.org/2000/svg"></svg>'

function surface(state: "empty" | "added" = "empty") {
  return screen.getByRole("img", { name: `Signature ${state}` })
}

function draw(
  element: Element,
  points: [number, number][],
  { pointerId = 1, button = 0 } = {}
) {
  const [start, ...rest] = points
  fireEvent.pointerDown(element, {
    pointerId,
    button,
    clientX: start[0],
    clientY: start[1],
  })
  for (const [clientX, clientY] of rest) {
    fireEvent.pointerMove(element, { pointerId, clientX, clientY })
  }
  fireEvent.pointerUp(element, { pointerId })
}

describe("SignaturePad", () => {
  beforeEach(() => {
    vi.spyOn(SVGElement.prototype, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      width: 300,
      height: 100,
    } as DOMRect)
  })

  it("names the group and marks the surface empty", () => {
    render(<SignaturePad aria-label="Signature" />)

    expect(screen.getByRole("group", { name: "Signature" })).toBeInTheDocument()
    expect(surface()).toBeInTheDocument()
    expect(screen.getByText("Sign here")).toBeInTheDocument()
  })

  it("emits SVG in pad coordinates when a stroke ends, not during it", () => {
    const onValueChange = vi.fn()
    render(<SignaturePad onValueChange={onValueChange} />)
    const pad = surface()

    fireEvent.pointerDown(pad, { pointerId: 1, clientX: 10, clientY: 20 })
    fireEvent.pointerMove(pad, { pointerId: 1, clientX: 30, clientY: 40 })
    expect(onValueChange).not.toHaveBeenCalled()
    expect(screen.queryByText("Sign here")).not.toBeInTheDocument()

    fireEvent.pointerUp(pad, { pointerId: 1 })

    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(onValueChange.mock.calls[0][0]).toContain('d="M20 40L60 80"')
    expect(onValueChange.mock.calls[0][0]).toContain('stroke="currentColor"')
    expect(surface("added")).toBeInTheDocument()
  })

  it("ignores a second pointer and non-primary buttons", () => {
    const onValueChange = vi.fn()
    render(<SignaturePad onValueChange={onValueChange} />)
    const pad = surface()

    draw(
      pad,
      [
        [0, 0],
        [5, 5],
      ],
      { button: 2 }
    )
    expect(onValueChange).not.toHaveBeenCalled()

    fireEvent.pointerDown(pad, { pointerId: 1, clientX: 0, clientY: 0 })
    fireEvent.pointerDown(pad, { pointerId: 2, clientX: 50, clientY: 50 })
    fireEvent.pointerMove(pad, { pointerId: 2, clientX: 60, clientY: 60 })
    fireEvent.pointerUp(pad, { pointerId: 2 })
    expect(onValueChange).not.toHaveBeenCalled()

    fireEvent.pointerUp(pad, { pointerId: 1 })
    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(onValueChange.mock.calls[0][0]).toContain('d="M0 0l.01 0"')
  })

  it("keeps the stroke when the browser cancels the pointer", () => {
    const onValueChange = vi.fn()
    render(<SignaturePad onValueChange={onValueChange} />)
    const pad = surface()

    fireEvent.pointerDown(pad, { pointerId: 1, clientX: 0, clientY: 0 })
    fireEvent.pointerCancel(pad, { pointerId: 1 })

    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  it("undoes the last stroke and clears from the keyboard", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<SignaturePad onValueChange={onValueChange} />)
    const pad = surface()
    draw(pad, [
      [0, 0],
      [5, 5],
    ])
    draw(pad, [
      [10, 10],
      [15, 15],
    ])

    const undo = screen.getByRole("button", { name: "Undo" })
    undo.focus()
    await user.keyboard("{Enter}")
    expect(onValueChange.mock.lastCall?.[0].match(/<path /g)).toHaveLength(1)

    await user.keyboard("{Enter}")
    expect(onValueChange).toHaveBeenLastCalledWith("")
    expect(undo).toHaveFocus()
    expect(undo).toHaveAttribute("aria-disabled", "true")

    await user.keyboard("{Enter}")
    expect(onValueChange).toHaveBeenCalledTimes(4)

    draw(pad, [
      [0, 0],
      [5, 5],
    ])
    await user.click(screen.getByRole("button", { name: "Clear" }))
    expect(onValueChange).toHaveBeenLastCalledWith("")
    expect(surface()).toBeInTheDocument()
  })

  it("offers a typed name that works without a pointer", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<SignaturePad onValueChange={onValueChange} />)

    await user.tab()
    expect(screen.getByRole("button", { name: "Type instead" })).toHaveFocus()
    await user.keyboard("{Enter}")

    const input = screen.getByRole("textbox", { name: "Type your name" })
    expect(input).toHaveFocus()
    await user.keyboard("Ada")

    expect(onValueChange.mock.lastCall?.[0]).toContain(">Ada</text>")
    expect(surface("added")).toBeInTheDocument()

    await user.clear(input)
    await user.keyboard("   ")
    expect(onValueChange).toHaveBeenLastCalledWith("")
  })

  it("restores each mode's ink when switching between them", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<SignaturePad onValueChange={onValueChange} />)
    draw(surface(), [
      [0, 0],
      [5, 5],
    ])

    await user.click(screen.getByRole("button", { name: "Type instead" }))
    expect(onValueChange).toHaveBeenLastCalledWith("")

    await user.click(screen.getByRole("button", { name: "Draw instead" }))
    expect(onValueChange.mock.lastCall?.[0]).toContain("<path ")
  })

  it("resets when a controlled value is cleared from outside", async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [signature, setSignature] = React.useState("")
      return (
        <>
          <SignaturePad value={signature} onValueChange={setSignature} />
          <button onClick={() => setSignature("")}>Reset</button>
        </>
      )
    }
    render(<Controlled />)
    draw(surface(), [
      [0, 0],
      [5, 5],
    ])
    expect(surface("added")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Reset" }))

    expect(surface()).toBeInTheDocument()
    expect(screen.getByText("Sign here")).toBeInTheDocument()
  })

  it("shows a saved value and locks drawing until it is cleared", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<SignaturePad defaultValue={SAVED} onValueChange={onValueChange} />)
    const pad = surface("added")

    draw(pad, [
      [0, 0],
      [5, 5],
    ])
    expect(onValueChange).not.toHaveBeenCalled()
    expect(screen.getByRole("button", { name: "Type instead" })).toBeDisabled()

    await user.click(screen.getByRole("button", { name: "Clear" }))
    expect(onValueChange).toHaveBeenLastCalledWith("")

    draw(surface(), [
      [0, 0],
      [5, 5],
    ])
    expect(onValueChange).toHaveBeenCalledTimes(2)
  })

  it("does nothing while disabled", () => {
    const onValueChange = vi.fn()
    render(<SignaturePad disabled onValueChange={onValueChange} />)

    draw(surface(), [
      [0, 0],
      [5, 5],
    ])

    expect(onValueChange).not.toHaveBeenCalled()
    for (const button of screen.getAllByRole("button")) {
      expect(button).toBeDisabled()
    }
  })

  it("submits the value through a hidden input", () => {
    const { container } = render(
      <SignaturePad name="signature" defaultValue={SAVED} />
    )

    expect(
      container.querySelector<HTMLInputElement>('input[name="signature"]')
        ?.value
    ).toBe(SAVED)
  })

  it("spreads props and merges className onto the root", () => {
    render(<SignaturePad data-testid="pad" className="max-w-sm" />)

    expect(screen.getByTestId("pad")).toHaveClass("grid", "max-w-sm")
  })
})
