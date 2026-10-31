"use client"

import * as React from "react"

import { Label } from "@/registry/default/ui/label"
import {
  PasswordInput,
  PasswordStrength,
  type PasswordStrengthLabels,
  type PasswordStrengthScore,
} from "@/registry/default/ui/password-input"

const LABELS: PasswordStrengthLabels = [
  "Keep going",
  "12 characters needed",
  "Add a number",
  "Add a symbol",
  "Meets the policy",
]

function scoreForPolicy(value: string): PasswordStrengthScore {
  if (value.length === 0) return 0
  if (value.length < 12) return 1
  if (!/\d/.test(value)) return 2
  if (!/[^\w\s]/.test(value)) return 3
  return 4
}

export function PasswordInputCustomRulesPreview() {
  const [password, setPassword] = React.useState("")

  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="password-policy">New password</Label>
      <PasswordInput
        id="password-policy"
        autoComplete="new-password"
        placeholder="Try a password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <PasswordStrength
        value={password}
        getScore={scoreForPolicy}
        labels={LABELS}
      />
    </div>
  )
}
