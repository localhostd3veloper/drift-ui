import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/registry/base/ui/stepper"

const STEPS = ["Create your workspace", "Invite the team", "Connect billing"]

export function StepperVerticalPreview() {
  return (
    <Stepper orientation="vertical" defaultValue={1}>
      <StepperList aria-label="Setup steps">
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
    </Stepper>
  )
}
