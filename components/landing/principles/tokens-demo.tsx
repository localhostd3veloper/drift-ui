"use client"

import { useState } from "react"

import { cn } from "@/registry/default/lib/utils"
import { Badge } from "@/registry/default/ui/badge"
import { Button } from "@/registry/default/ui/button"
import { Label } from "@/registry/default/ui/label"
import { NumberInput } from "@/registry/default/ui/number-input"
import { TagsInput } from "@/registry/default/ui/tags-input"
import { StepperSpecimen } from "@/components/landing/specimens/stepper-specimen"

const PRESETS = [
  { id: "neutral", label: "Neutral", swatch: "bg-foreground" },
  { id: "cobalt", label: "Cobalt", swatch: "bg-[oklch(0.6_0.17_260)]" },
  { id: "emerald", label: "Emerald", swatch: "bg-[oklch(0.62_0.13_163)]" },
  { id: "ember", label: "Ember", swatch: "bg-[oklch(0.64_0.18_45)]" },
] as const

const RADII = [
  { value: "0rem", label: "0" },
  { value: "0.375rem", label: "0.375" },
  { value: "0.625rem", label: "0.625" },
  { value: "1rem", label: "1" },
] as const

type PresetId = (typeof PRESETS)[number]["id"]
type Radius = (typeof RADII)[number]["value"]

function ControlButton({
  isPressed,
  onClick,
  children,
  className,
}: {
  isPressed: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      aria-pressed={isPressed}
      onClick={onClick}
      className={cn(
        "flex h-8 items-center gap-2 rounded-md border px-2.5 font-mono text-xs text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-[0.97] aria-pressed:border-foreground/40 aria-pressed:bg-accent aria-pressed:text-foreground",
        className
      )}
    >
      {children}
    </button>
  )
}

export function TokensDemo() {
  const [preset, setPreset] = useState<PresetId>("cobalt")
  const [radius, setRadius] = useState<Radius>("0.625rem")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div
          role="group"
          aria-label="Primary"
          className="flex flex-wrap gap-1.5"
        >
          {PRESETS.map((option) => (
            <ControlButton
              key={option.id}
              isPressed={preset === option.id}
              onClick={() => setPreset(option.id)}
            >
              <span className={cn("size-2.5 rounded-full", option.swatch)} />
              {option.label}
            </ControlButton>
          ))}
        </div>
        <div
          role="group"
          aria-label="Radius"
          className="flex flex-wrap gap-1.5"
        >
          {RADII.map((option) => (
            <ControlButton
              key={option.value}
              isPressed={radius === option.value}
              onClick={() => setRadius(option.value)}
            >
              {option.label}
            </ControlButton>
          ))}
        </div>
      </div>
      <div
        data-preset={preset}
        style={{ "--radius": radius } as React.CSSProperties}
        className="flex flex-col gap-5 rounded-xl border bg-card p-5 text-card-foreground shadow-[0_24px_48px_-24px] shadow-black/10 dark:shadow-black/60"
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium">New project</span>
          <Badge>Draft</Badge>
        </div>
        <StepperSpecimen />
        <div className="grid gap-2">
          <Label htmlFor="tokens-demo-tags">Environments</Label>
          <TagsInput
            id="tokens-demo-tags"
            defaultValue={["staging", "eu-west-1"]}
            placeholder="Add environment"
          />
        </div>
        <div className="flex items-end justify-between gap-4">
          <div className="grid gap-2">
            <Label htmlFor="tokens-demo-seats">Seats</Label>
            <NumberInput
              id="tokens-demo-seats"
              defaultValue={8}
              min={1}
              max={50}
              className="w-32"
            />
          </div>
          <Button className="active:scale-[0.98]">Create project</Button>
        </div>
      </div>
    </div>
  )
}
