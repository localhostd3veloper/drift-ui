"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import { Slot } from "radix-ui"

import { cn } from "@/registry/default/lib/utils"
import { useControllableState } from "@/registry/default/hooks/use-controllable-state"
import { Button } from "@/registry/default/ui/button"
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/registry/default/ui/popover"
import {
  TourSpotlight,
  findTourTarget,
  useScrollTargetIntoView,
} from "@/registry/default/ui/tour-spotlight"

type TourStep = {
  target: string
  title: string
  description?: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
}

function TourTarget({
  name,
  ...props
}: React.ComponentProps<typeof Slot.Root> & { name: string }) {
  return <Slot.Root data-tour-target={name} {...props} />
}

function TourProgress({ count, current }: { count: number; current: number }) {
  return (
    <div aria-hidden className="flex items-center gap-1">
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={cn(
            "h-1.5 rounded-full bg-muted-foreground/30 transition-all duration-300",
            index === current ? "w-4 bg-foreground" : "w-1.5"
          )}
        />
      ))}
    </div>
  )
}

function Tour({
  steps,
  open,
  defaultOpen = false,
  onOpenChange,
  step,
  defaultStep = 0,
  onStepChange,
  onComplete,
  children,
}: {
  steps: TourStep[]
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  step?: number
  defaultStep?: number
  onStepChange?: (step: number) => void
  onComplete?: () => void
  children?: React.ReactNode
}) {
  const titleId = React.useId()
  const nextButtonRef = React.useRef<HTMLButtonElement>(null)
  const returnFocusRef = React.useRef<HTMLElement | null>(null)
  const { value: isOpen, setValue: setIsOpen } = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })
  const { value: stepIndex, setValue: setStepIndex } = useControllableState({
    value: step,
    defaultValue: defaultStep,
    onChange: onStepChange,
  })
  const currentStep = isOpen ? steps[stepIndex] : undefined
  const isLastStep = stepIndex === steps.length - 1
  const targetName = currentStep?.target ?? null
  useScrollTargetIntoView(targetName)

  const virtualAnchor = React.useMemo(
    () => ({
      current: {
        getBoundingClientRect: () =>
          (targetName && findTourTarget(targetName)?.getBoundingClientRect()) ||
          new DOMRect(),
      },
    }),
    [targetName]
  )

  function endTour() {
    setIsOpen(false)
    setStepIndex(0)
  }

  function goNext() {
    if (!isLastStep) return setStepIndex(stepIndex + 1)
    endTour()
    onComplete?.()
  }

  function goBack() {
    if (stepIndex > 0) setStepIndex(stepIndex - 1)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case "ArrowRight":
        return goNext()
      case "ArrowLeft":
        return goBack()
    }
  }

  return (
    <>
      {children}
      {currentStep && (
        <Popover open modal onOpenChange={(next) => !next && endTour()}>
          <PopoverAnchor virtualRef={virtualAnchor} />
          <TourSpotlight target={currentStep.target} />
          <PopoverContent
            data-slot="tour-card"
            role="dialog"
            aria-labelledby={titleId}
            side={currentStep.side ?? "bottom"}
            sideOffset={14}
            updatePositionStrategy="always"
            onOpenAutoFocus={(event) => {
              event.preventDefault()
              if (document.activeElement instanceof HTMLElement)
                returnFocusRef.current = document.activeElement
              nextButtonRef.current?.focus()
            }}
            onCloseAutoFocus={(event) => {
              event.preventDefault()
              returnFocusRef.current?.focus()
              returnFocusRef.current = null
            }}
            onInteractOutside={(event) => event.preventDefault()}
            onKeyDown={handleKeyDown}
            className="flex w-80 flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[11px] text-muted-foreground">
                  {stepIndex + 1} of {steps.length}
                </span>
                <h2 id={titleId} className="leading-none font-medium">
                  {currentStep.title}
                </h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="End tour"
                onClick={endTour}
                className="-mt-1 -mr-2 size-7"
              >
                <XIcon />
              </Button>
            </div>
            {currentStep.description && (
              <div className="text-sm text-muted-foreground">
                {currentStep.description}
              </div>
            )}
            <div className="flex items-center justify-between">
              <TourProgress count={steps.length} current={stepIndex} />
              <div className="flex gap-2">
                {stepIndex > 0 && (
                  <Button variant="ghost" size="sm" onClick={goBack}>
                    Back
                  </Button>
                )}
                <Button ref={nextButtonRef} size="sm" onClick={goNext}>
                  {isLastStep ? "Finish" : "Next"}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </>
  )
}

export { Tour, TourTarget, type TourStep }
