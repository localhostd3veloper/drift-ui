"use client"

import { Button } from "@/registry/default/ui/button"
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
  useStepper,
} from "@/registry/default/ui/stepper"

const STEPS = ["Cart", "Shipping", "Payment"]

function CheckoutProgress() {
  const { activeStep, setActiveStep } = useStepper()

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        Step {activeStep + 1} of {STEPS.length}
      </p>
      <Button variant="ghost" size="sm" onClick={() => setActiveStep(0)}>
        Start over
      </Button>
    </div>
  )
}

export function StepperCustomControlsPreview() {
  return (
    <Stepper defaultValue={2} className="w-full max-w-md">
      <StepperList aria-label="Checkout steps">
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
      <CheckoutProgress />
    </Stepper>
  )
}
