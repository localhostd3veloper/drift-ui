"use client"

import * as React from "react"

import { Button } from "@/registry/default/ui/button"
import { Tour, TourTarget, type TourStep } from "@/registry/default/ui/tour"

const STEPS: TourStep[] = [
  { target: "draft", title: "Write a draft" },
  { target: "review", title: "Ask for review" },
  { target: "publish", title: "Publish it", side: "left" },
]

export function TourControlledStepPreview() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [step, setStep] = React.useState(1)

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Tour
        steps={STEPS}
        open={isOpen}
        onOpenChange={setIsOpen}
        step={step}
        onStepChange={setStep}
      >
        <div className="flex gap-2">
          {STEPS.map(({ target }) => (
            <TourTarget key={target} name={target}>
              <Button variant="outline" className="capitalize">
                {target}
              </Button>
            </TourTarget>
          ))}
        </div>
        <Button onClick={() => setIsOpen(true)}>Resume tour</Button>
      </Tour>
      <p className="text-sm text-muted-foreground">
        Step {step + 1} of {STEPS.length}
      </p>
    </div>
  )
}
