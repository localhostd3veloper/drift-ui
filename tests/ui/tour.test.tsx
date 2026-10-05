import * as React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Tour, TourTarget, type TourStep } from "@/registry/default/ui/tour"

const STEPS: TourStep[] = [
  {
    target: "search",
    title: "Search everything",
    description: "Find any project.",
  },
  { target: "create", title: "Create a project" },
]

function TestTour(props: Partial<React.ComponentProps<typeof Tour>>) {
  return (
    <Tour steps={STEPS} {...props}>
      <TourTarget name="search">
        <input aria-label="Search" />
      </TourTarget>
      <TourTarget name="create">
        <button type="button">New project</button>
      </TourTarget>
    </Tour>
  )
}

describe("Tour", () => {
  it("renders nothing extra until opened", () => {
    render(<TestTour />)
    expect(screen.queryByRole("dialog")).toBeNull()
    expect(screen.getByLabelText("Search")).toHaveAttribute(
      "data-tour-target",
      "search"
    )
  })

  it("opens on the first step with focus on Next and walks through to completion", async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    const onOpenChange = vi.fn()
    render(
      <TestTour
        defaultOpen
        onComplete={onComplete}
        onOpenChange={onOpenChange}
      />
    )

    const dialog = screen.getByRole("dialog", { name: "Search everything" })
    expect(dialog).toHaveTextContent("1 of 2")
    expect(screen.getByRole("button", { name: "Next" })).toHaveFocus()

    await user.click(screen.getByRole("button", { name: "Next" }))
    expect(
      screen.getByRole("dialog", { name: "Create a project" })
    ).toHaveTextContent("2 of 2")

    await user.click(screen.getByRole("button", { name: "Finish" }))
    expect(onComplete).toHaveBeenCalledOnce()
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
    expect(screen.queryByRole("dialog")).toBeNull()
  })

  it("navigates with the arrow keys and ends with Escape", async () => {
    const user = userEvent.setup()
    const onStepChange = vi.fn()
    const onOpenChange = vi.fn()
    render(
      <TestTour
        defaultOpen
        onStepChange={onStepChange}
        onOpenChange={onOpenChange}
      />
    )

    await user.keyboard("{ArrowRight}")
    expect(onStepChange).toHaveBeenLastCalledWith(1)
    await user.keyboard("{ArrowLeft}")
    expect(onStepChange).toHaveBeenLastCalledWith(0)

    await user.keyboard("{Escape}")
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
  })

  it("returns focus to the button that started it", async () => {
    const user = userEvent.setup()

    function StartableTour() {
      const [isOpen, setIsOpen] = React.useState(false)
      return (
        <>
          <button type="button" onClick={() => setIsOpen(true)}>
            Start tour
          </button>
          <TestTour open={isOpen} onOpenChange={setIsOpen} />
        </>
      )
    }
    render(<StartableTour />)
    const startButton = screen.getByRole("button", { name: "Start tour" })

    await user.click(startButton)
    expect(screen.getByRole("button", { name: "Next" })).toHaveFocus()

    await user.keyboard("{Escape}")
    expect(screen.queryByRole("dialog")).toBeNull()
    await waitFor(() => expect(startButton).toHaveFocus())
  })
})
