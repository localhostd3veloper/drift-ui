"use client"

import * as React from "react"

import { cn } from "@/registry/default/lib/utils"
import { Button } from "@/registry/default/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"
import { Input } from "@/registry/default/ui/input"
import { Label } from "@/registry/default/ui/label"
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

const STEPS = ["Name", "Region", "Review"]

const REGIONS = [
  { id: "eu-central-1", city: "Frankfurt", latency: "18 ms" },
  { id: "us-east-1", city: "N. Virginia", latency: "84 ms" },
  { id: "ap-southeast-1", city: "Singapore", latency: "162 ms" },
]

function toSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export function CreateProjectCard() {
  const [step, setStep] = React.useState(0)
  const [name, setName] = React.useState("Payments API")
  const [region, setRegion] = React.useState(REGIONS[0].id)
  const [isCreated, setIsCreated] = React.useState(false)
  const slug = toSlug(name)
  const selectedRegion = REGIONS.find((option) => option.id === region)
  const isLastStep = step === STEPS.length - 1

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>
          Spin up a new service in under a minute.
        </CardDescription>
        <CardAction className="text-xs text-muted-foreground tabular-nums">
          {step + 1} of {STEPS.length}
        </CardAction>
      </CardHeader>
      <Stepper
        linear
        value={step}
        onValueChange={setStep}
        stepCount={STEPS.length}
        className="gap-6"
      >
        <CardContent className="flex flex-col gap-6">
          <StepperList aria-label="Project setup steps">
            {STEPS.map((title, index) => (
              <StepperItem key={title} step={index}>
                <StepperTrigger>
                  <StepperIndicator />
                  <StepperTitle className={cn(index !== step && "sr-only")}>
                    {title}
                  </StepperTitle>
                </StepperTrigger>
                <StepperSeparator />
              </StepperItem>
            ))}
          </StepperList>
          <StepperContent step={0} className="grid gap-2">
            <Label htmlFor="create-project-name">Project name</Label>
            <Input
              id="create-project-name"
              value={name}
              placeholder="Payments API"
              onChange={(event) => setName(event.target.value)}
            />
            <p className="truncate text-xs text-muted-foreground">
              ledgerline.dev/
              <span className="text-foreground">{slug || "your-project"}</span>
            </p>
          </StepperContent>
          <StepperContent step={1}>
            <div
              role="radiogroup"
              aria-label="Region"
              className="flex flex-col gap-2"
            >
              {REGIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={region === option.id}
                  onClick={() => setRegion(option.id)}
                  className={cn(
                    "flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    region === option.id &&
                      "border-primary ring-[3px] ring-primary/15"
                  )}
                >
                  <span className="flex flex-col">
                    <span className="font-medium">{option.city}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {option.id}
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {option.latency}
                  </span>
                </button>
              ))}
            </div>
          </StepperContent>
          <StepperContent step={2}>
            <dl className="grid grid-cols-[5rem_1fr] gap-x-4 gap-y-2 rounded-md border p-3 text-sm">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="truncate">{name || "Untitled"}</dd>
              <dt className="text-muted-foreground">URL</dt>
              <dd className="truncate font-mono text-xs leading-5">
                /{slug || "your-project"}
              </dd>
              <dt className="text-muted-foreground">Region</dt>
              <dd>{selectedRegion?.city}</dd>
            </dl>
          </StepperContent>
        </CardContent>
        <CardFooter className="justify-between border-t">
          <StepperPrevious asChild>
            <Button variant="ghost">Back</Button>
          </StepperPrevious>
          {isLastStep ? (
            <Button disabled={isCreated} onClick={() => setIsCreated(true)}>
              {isCreated ? "Project created" : "Create project"}
            </Button>
          ) : (
            <StepperNext asChild disabled={step === 0 && !slug}>
              <Button>Continue</Button>
            </StepperNext>
          )}
        </CardFooter>
      </Stepper>
    </Card>
  )
}
