import { Button } from "@/registry/base/ui/button"
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
} from "@/registry/base/ui/stepper"

const STEPS = [
  { title: "Source", body: "Connect the repository to deploy from." },
  { title: "Configure", body: "Pick environments and replica counts." },
  { title: "Review", body: "Check the plan before anything ships." },
  { title: "Deploy", body: "Roll out and watch the first health checks." },
]

export function StepperPreview() {
  return (
    <>
      <Stepper
        linear
        stepCount={STEPS.length}
        defaultValue={1}
        className="w-full max-w-xl"
      >
        <StepperList aria-label="Deployment steps">
          {STEPS.map((step, index) => (
            <StepperItem key={step.title} step={index}>
              <StepperTrigger>
                <StepperIndicator />
                <StepperTitle>{step.title}</StepperTitle>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>
          ))}
        </StepperList>
        {STEPS.map((step, index) => (
          <StepperContent
            key={step.title}
            step={index}
            className="rounded-lg border p-4 text-sm text-muted-foreground"
          >
            {step.body}
          </StepperContent>
        ))}
        <div className="flex justify-between">
          <StepperPrevious asChild>
            <Button variant="outline">Back</Button>
          </StepperPrevious>
          <StepperNext asChild>
            <Button>Continue</Button>
          </StepperNext>
        </div>
      </Stepper>
    </>
  )
}
