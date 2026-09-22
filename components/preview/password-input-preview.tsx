"use client"

import * as React from "react"

import { Label } from "@/registry/default/ui/label"
import {
  PasswordInput,
  PasswordStrength,
} from "@/registry/default/ui/password-input"

export function PasswordInputPreview() {
  const [password, setPassword] = React.useState("copper-lantern")

  return (
    <>
      <div className="grid w-full max-w-sm gap-2">
        <Label htmlFor="preview-password">New password</Label>
        <PasswordInput
          id="preview-password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <PasswordStrength value={password} />
      </div>
    </>
  )
}
