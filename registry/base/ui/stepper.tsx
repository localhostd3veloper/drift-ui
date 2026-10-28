"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@/registry/default/lib/utils"

type StepState = "completed" | "active" | "upcoming"

type StepperContextValue = {
  activeStep: number
  furthestStep: number
  setActiveStep: (step: number) => void
  isLinear: boolean
  stepCount?: number
}

const StepperContext = React.createContext<StepperContextValue | null>(null)
const StepperItemContext = React.createContext<{
  step: number
  state: StepState
} | null>(null)

function useStepper() {
  const context = React.useContext(StepperContext)
  if (!context) throw new Error("useStepper must be used within <Stepper>")
  return context
}

function useStepperItem() {
  const context = React.useContext(StepperItemContext)
  if (!context)
    throw new Error("Stepper parts must be used within <StepperItem>")
  return context
}

function Stepper({
  value,
  defaultValue = 0,
  onValueChange,
  linear = false,
  stepCount,
  orientation = "horizontal",
  className,
  ...props
}: Omit<
  TabsPrimitive.Root.Props,
  "value" | "defaultValue" | "onValueChange"
> & {
  value?: number
  defaultValue?: number
  onValueChange?: (step: number) => void
  linear?: boolean
  stepCount?: number
}) {
  const [uncontrolledStep, setUncontrolledStep] = React.useState(defaultValue)
  const activeStep = value ?? uncontrolledStep
  const [furthestStep, setFurthestStep] = React.useState(activeStep)

  if (activeStep > furthestStep) setFurthestStep(activeStep)

  function setActiveStep(step: number) {
    if (value === undefined) setUncontrolledStep(step)
    onValueChange?.(step)
  }

  return (
    <StepperContext.Provider
      value={{
        activeStep,
        furthestStep,
        setActiveStep,
        isLinear: linear,
        stepCount,
      }}
    >
      <TabsPrimitive.Root
        data-slot="stepper"
        value={activeStep}
        onValueChange={(next: number) => setActiveStep(next)}
        orientation={orientation}
        className={cn(
          "group/stepper flex gap-6 data-[orientation=horizontal]:flex-col",
          className
        )}
        {...props}
      />
    </StepperContext.Provider>
  )
}

function StepperList({ className, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="stepper-list"
      className={cn(
        "flex gap-2 group-data-[orientation=horizontal]/stepper:items-center group-data-[orientation=vertical]/stepper:flex-col",
        className
      )}
      {...props}
    />
  )
}

function StepperItem({
  step,
  className,
  ...props
}: React.ComponentProps<"div"> & { step: number }) {
  const { activeStep } = useStepper()
  const state: StepState =
    step < activeStep
      ? "completed"
      : step === activeStep
        ? "active"
        : "upcoming"

  return (
    <StepperItemContext.Provider value={{ step, state }}>
      <div
        data-slot="stepper-item"
        data-state={state}
        className={cn(
          "group/step flex flex-1 gap-2 group-data-[orientation=horizontal]/stepper:items-center group-data-[orientation=vertical]/stepper:flex-col last:flex-none",
          className
        )}
        {...props}
      />
    </StepperItemContext.Provider>
  )
}

function StepperTrigger({
  className,
  disabled,
  ...props
}: Omit<TabsPrimitive.Tab.Props, "value">) {
  const { furthestStep, isLinear } = useStepper()
  const { step } = useStepperItem()

  return (
    <TabsPrimitive.Tab
      data-slot="stepper-trigger"
      value={step}
      disabled={disabled || (isLinear && step > furthestStep)}
      className={cn(
        "flex shrink-0 items-center gap-2.5 rounded-md text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 data-disabled:pointer-events-none data-disabled:opacity-60",
        className
      )}
      {...props}
    />
  )
}

function StepperIndicator({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  const { step, state } = useStepperItem()

  return (
    <span
      data-slot="stepper-indicator"
      data-state={state}
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium text-muted-foreground tabular-nums transition-colors",
        "data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:ring-[3px] data-[state=active]:ring-primary/15",
        "data-[state=completed]:border-primary data-[state=completed]:bg-primary data-[state=completed]:text-primary-foreground",
        className
      )}
      {...props}
    >
      {children ??
        (state === "completed" ? <CheckIcon className="size-3.5" /> : step + 1)}
    </span>
  )
}

function StepperTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="stepper-title"
      className={cn(
        "text-sm font-medium group-data-[state=upcoming]/step:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function StepperDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="stepper-description"
      className={cn("block text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function StepperSeparator({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="stepper-separator"
      aria-hidden
      className={cn(
        "flex-1 bg-border transition-colors group-last/step:hidden group-data-[state=completed]/step:bg-primary",
        "group-data-[orientation=horizontal]/stepper:h-px group-data-[orientation=horizontal]/stepper:min-w-6",
        "group-data-[orientation=vertical]/stepper:ml-3.5 group-data-[orientation=vertical]/stepper:min-h-6 group-data-[orientation=vertical]/stepper:w-px",
        className
      )}
      {...props}
    />
  )
}

function StepperContent({
  step,
  className,
  ...props
}: Omit<TabsPrimitive.Panel.Props, "value"> & {
  step: number
}) {
  return (
    <TabsPrimitive.Panel
      data-slot="stepper-content"
      value={step}
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

function SlotButton({
  asChild,
  children,
  ...props
}: React.ComponentProps<"button"> & { asChild: boolean }) {
  return useRender({
    defaultTagName: "button",
    render: asChild ? (children as React.ReactElement) : undefined,
    props: asChild ? props : { ...props, children },
  })
}

function StepperPrevious({
  asChild = false,
  disabled,
  onClick,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { activeStep, setActiveStep } = useStepper()

  return (
    <SlotButton
      asChild={asChild}
      data-slot="stepper-previous"
      type="button"
      disabled={disabled || activeStep === 0}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (!event.defaultPrevented) setActiveStep(activeStep - 1)
      }}
      {...props}
    />
  )
}

function StepperNext({
  asChild = false,
  disabled,
  onClick,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { activeStep, setActiveStep, stepCount } = useStepper()
  const isLastStep = stepCount !== undefined && activeStep >= stepCount - 1

  return (
    <SlotButton
      asChild={asChild}
      data-slot="stepper-next"
      type="button"
      disabled={disabled || isLastStep}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (!event.defaultPrevented) setActiveStep(activeStep + 1)
      }}
      {...props}
    />
  )
}

export {
  Stepper,
  StepperList,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperDescription,
  StepperSeparator,
  StepperContent,
  StepperPrevious,
  StepperNext,
  useStepper,
}
