"use client"

import * as React from "react"

import { Badge } from "@/registry/default/ui/badge"
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
import { Label } from "@/registry/default/ui/label"
import { NumberInput } from "@/registry/default/ui/number-input"

const PRICE_PER_SEAT = 12
const ACTIVE_MEMBERS = 9
const CURRENT_SEATS = 12

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export function SeatsCard() {
  const [seats, setSeats] = React.useState<number | null>(CURRENT_SEATS)
  const seatCount = seats ?? 0
  const monthlyTotal = seatCount * PRICE_PER_SEAT
  const difference = monthlyTotal - CURRENT_SEATS * PRICE_PER_SEAT
  const usage = seatCount > 0 ? Math.min(ACTIVE_MEMBERS / seatCount, 1) : 1
  const isBelowUsage = seatCount < ACTIVE_MEMBERS
  const isUnchanged = seatCount === CURRENT_SEATS

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seats</CardTitle>
        <CardDescription>Team plan, billed monthly.</CardDescription>
        <CardAction>
          <Badge variant="secondary">Team</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-end justify-between gap-4">
          <div className="grid gap-2">
            <Label htmlFor="seats-count">Seats</Label>
            <NumberInput
              id="seats-count"
              value={seats}
              onValueChange={setSeats}
              min={1}
              max={200}
              className="w-32"
            />
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-2xl font-semibold tracking-tight tabular-nums">
              {currency.format(monthlyTotal)}
            </span>
            <span className="text-xs text-muted-foreground">per month</span>
          </div>
        </div>
        <div className="grid gap-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{ACTIVE_MEMBERS} active members</span>
            <span className="tabular-nums">
              {Math.round(usage * 100)}% used
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300"
              style={{ width: `${usage * 100}%` }}
            />
          </div>
        </div>
        <dl className="grid grid-cols-[1fr_auto] gap-y-2 rounded-md border p-3 text-sm">
          <dt className="text-muted-foreground">Per seat</dt>
          <dd className="text-right tabular-nums">
            {currency.format(PRICE_PER_SEAT)}
          </dd>
          <dt className="text-muted-foreground">Change from today</dt>
          <dd className="text-right tabular-nums">
            {difference > 0 ? "+" : ""}
            {currency.format(difference)}
          </dd>
        </dl>
        {isBelowUsage && (
          <p role="alert" className="text-xs text-destructive">
            Remove {ACTIVE_MEMBERS - seatCount} members before dropping below{" "}
            {ACTIVE_MEMBERS} seats.
          </p>
        )}
      </CardContent>
      <CardFooter className="justify-between gap-4 border-t">
        <span className="text-xs text-muted-foreground">Renews Nov 1</span>
        <Button size="sm" disabled={isBelowUsage || isUnchanged}>
          Update plan
        </Button>
      </CardFooter>
    </Card>
  )
}
