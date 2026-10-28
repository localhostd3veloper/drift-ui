import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperNext,
  StepperPrevious,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/registry/default/ui/stepper"

const STEPS = ["Account", "Workspace", "Invite"]

function TestStepper(props: Partial<React.ComponentProps<typeof Stepper>>) {
  return (
    <Stepper stepCount={STEPS.length} {...props}>
      <StepperList aria-label="Onboarding">
        {STEPS.map((title, index) => (
          <StepperItem key={title} step={index}>
            <StepperTrigger>
              <StepperIndicator />
              <StepperTitle>{title}</StepperTitle>
            </StepperTrigger>
            <StepperSeparator />
          </StepperItem>
        ))}
      </StepperList>
      {STEPS.map((title, index) => (
        <StepperContent key={title} step={index}>
          {title} panel
        </StepperContent>
      ))}
      <StepperPrevious>Back</StepperPrevious>
      <StepperNext>Continue</StepperNext>
    </Stepper>
  )
}

function trigger(name: string) {
  return screen.getByRole("tab", { name: new RegExp(name) })
}

describe("Stepper", () => {
  it("shows the active step panel and marks earlier steps complete", () => {
    render(<TestStepper defaultValue={1} />)

    expect(screen.getByRole("tabpanel")).toHaveTextContent("Workspace panel")
    expect(trigger("Workspace")).toHaveAttribute("aria-selected", "true")
    const items = document.querySelectorAll("[data-slot=stepper-item]")
    expect(
      Array.from(items).map((item) => item.getAttribute("data-state"))
    ).toEqual(["completed", "active", "upcoming"])
  })

  it("advances and goes back with Next and Previous, reporting the step", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<TestStepper onValueChange={onValueChange} />)

    expect(screen.getByRole("button", { name: "Back" })).toBeDisabled()
    await user.click(screen.getByRole("button", { name: "Continue" }))
    expect(onValueChange).toHaveBeenLastCalledWith(1)
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Workspace panel")

    await user.click(screen.getByRole("button", { name: "Back" }))
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Account panel")
  })

  it("disables Next on the last step when stepCount is set", () => {
    render(<TestStepper defaultValue={2} />)
    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled()
  })

  it("blocks skipping ahead in linear mode but keeps reached steps open", async () => {
    const user = userEvent.setup()
    render(<TestStepper linear />)

    await user.click(trigger("Workspace"))
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Account panel")
    await user.click(screen.getByRole("button", { name: "Continue" }))
    await user.click(screen.getByRole("button", { name: "Continue" }))
    await user.click(screen.getByRole("button", { name: "Back" }))
    await user.click(screen.getByRole("button", { name: "Back" }))

    await user.click(trigger("Invite"))
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Invite panel")
  })

  it("lets free mode jump to any step from the list", async () => {
    const user = userEvent.setup()
    render(<TestStepper />)

    await user.click(trigger("Invite"))
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Invite panel")
  })
})
