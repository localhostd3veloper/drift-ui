"use client"

import * as React from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { cn } from "@/registry/default/lib/utils"
import { Input } from "@/registry/default/ui/input"

type PasswordStrengthScore = 0 | 1 | 2 | 3 | 4

type PasswordStrengthLabels = readonly [string, string, string, string, string]

const DEFAULT_STRENGTH_LABELS: PasswordStrengthLabels = [
  "Too weak",
  "Weak",
  "Fair",
  "Good",
  "Strong",
]

const STRENGTH_SEGMENT_COUNT = 4

const SEGMENT_COLOR_BY_SCORE: Record<PasswordStrengthScore, string> = {
  0: "bg-muted",
  1: "bg-destructive",
  2: "bg-amber-500",
  3: "bg-emerald-500",
  4: "bg-emerald-500",
}

function scorePassword(value: string): PasswordStrengthScore {
  if (value.length === 0) return 0

  const checks = [
    value.length >= 8,
    value.length >= 12,
    /[a-z]/.test(value) && /[A-Z]/.test(value),
    /\d/.test(value),
    /[^A-Za-z0-9]/.test(value),
  ]
  const passed = checks.filter(Boolean).length

  return Math.max(1, Math.min(4, passed - 1)) as PasswordStrengthScore
}

function PasswordInput({
  className,
  disabled,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <div data-slot="password-input" className="relative">
      <Input
        type={isVisible ? "text" : "password"}
        disabled={disabled}
        className={cn("pr-9", className)}
        {...props}
      />
      <button
        type="button"
        data-slot="password-input-toggle"
        aria-label={isVisible ? "Hide password" : "Show password"}
        aria-pressed={isVisible}
        disabled={disabled}
        onClick={() => setIsVisible((previous) => !previous)}
        className="absolute inset-y-0 right-0 flex w-9 items-center justify-center rounded-r-md text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4"
      >
        {isVisible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  )
}

function PasswordStrength({
  value,
  getScore = scorePassword,
  labels = DEFAULT_STRENGTH_LABELS,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  value: string
  getScore?: (value: string) => PasswordStrengthScore
  labels?: PasswordStrengthLabels
}) {
  const score = getScore(value)
  const label = labels[score]

  return (
    <div
      data-slot="password-strength"
      data-score={score}
      className={cn("flex items-center gap-3", className)}
      {...props}
    >
      <div aria-hidden className="grid flex-1 grid-cols-4 gap-1">
        {Array.from({ length: STRENGTH_SEGMENT_COUNT }, (_, index) => (
          <span
            key={index}
            className={cn(
              "h-1 rounded-full bg-muted transition-colors duration-300",
              index < score && SEGMENT_COLOR_BY_SCORE[score]
            )}
          />
        ))}
      </div>
      <span
        role="status"
        aria-live="polite"
        className="min-w-14 text-right text-xs text-muted-foreground"
      >
        <span className="sr-only">Password strength: </span>
        {value.length > 0 ? label : ""}
      </span>
    </div>
  )
}

export {
  PasswordInput,
  PasswordStrength,
  scorePassword,
  type PasswordStrengthScore,
  type PasswordStrengthLabels,
}
