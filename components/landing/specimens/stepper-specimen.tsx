import { cn } from "@/registry/default/lib/utils"
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/registry/default/ui/stepper"

const STEPS = ["Source", "Configure", "Review", "Deploy"]
const ACTIVE_STEP_INDEX = 1

export function StepperSpecimen({ className }: { className?: string }) {
  return (
    <div className={cn("@container w-full", className)}>
      <Stepper defaultValue={ACTIVE_STEP_INDEX}>
        <StepperList aria-label="Deployment steps" className="text-xs">
          {STEPS.map((step, index) => (
            <StepperItem key={step} step={index}>
              <StepperTrigger>
                <StepperIndicator className="size-6 text-[11px]" />
                <StepperTitle
                  className={cn(
                    "text-xs",
                    index !== ACTIVE_STEP_INDEX && "hidden @sm:inline"
                  )}
                >
                  {step}
                </StepperTitle>
              </StepperTrigger>
              <StepperSeparator className="min-w-4" />
            </StepperItem>
          ))}
        </StepperList>
      </Stepper>
    </div>
  )
}
