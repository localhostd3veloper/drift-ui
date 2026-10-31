"use client"

import * as React from "react"

import { Button } from "@/registry/default/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"
import { Label } from "@/registry/default/ui/label"
import {
  PasswordInput,
  PasswordStrength,
  scorePassword,
} from "@/registry/default/ui/password-input"

const MIN_SCORE = 3

export function AccountSecurityCard() {
  const [current, setCurrent] = React.useState("")
  const [next, setNext] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  const [isSaved, setIsSaved] = React.useState(false)
  const isMismatch = confirm.length > 0 && confirm !== next
  const canSave =
    current.length > 0 &&
    scorePassword(next) >= MIN_SCORE &&
    confirm === next &&
    !isSaved

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (canSave) setIsSaved(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>Signs out every other session.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="security-current">Current password</Label>
            <PasswordInput
              id="security-current"
              autoComplete="current-password"
              value={current}
              onChange={(event) => setCurrent(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="security-new">New password</Label>
            <PasswordInput
              id="security-new"
              autoComplete="new-password"
              value={next}
              onChange={(event) => {
                setNext(event.target.value)
                setIsSaved(false)
              }}
            />
            <PasswordStrength value={next} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="security-confirm">Confirm password</Label>
            <PasswordInput
              id="security-confirm"
              autoComplete="new-password"
              value={confirm}
              aria-invalid={isMismatch || undefined}
              aria-describedby={
                isMismatch ? "security-confirm-error" : undefined
              }
              onChange={(event) => {
                setConfirm(event.target.value)
                setIsSaved(false)
              }}
            />
            {isMismatch && (
              <p
                id="security-confirm-error"
                className="text-xs text-destructive"
              >
                Passwords do not match.
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="justify-between gap-4 border-t">
          <span className="text-xs text-muted-foreground">
            {isSaved ? "Password updated just now" : "Last changed 94 days ago"}
          </span>
          <Button type="submit" size="sm" disabled={!canSave}>
            Update password
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
