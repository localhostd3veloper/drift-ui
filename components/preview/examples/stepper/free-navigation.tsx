import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/registry/default/ui/stepper"

const STEPS = [
  { title: "Profile", body: "Name, photo and time zone." },
  { title: "Security", body: "Passkeys and sessions." },
  { title: "Alerts", body: "Email and push preferences." },
]

export function StepperFreeNavigationPreview() {
  return (
    <Stepper className="w-full max-w-md">
      <StepperList aria-label="Account settings">
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
    </Stepper>
  )
}
