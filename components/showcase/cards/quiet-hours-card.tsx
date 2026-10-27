"use client"

import * as React from "react"
import { MoonIcon } from "lucide-react"

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
import { TimeField } from "@/registry/default/ui/time-field"

const DEFAULT_START = "22:00"
const DEFAULT_END = "07:30"

const STILL_DELIVERED = [
  "Incidents assigned to you",
  "Direct mentions from on-call",
]

function minutesOf(value: string) {
  const [hours, minutes] = value.split(":").map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
  return hours * 60 + minutes
}

function quietSpan(start: string, end: string) {
  const from = minutesOf(start)
  const to = minutesOf(end)
  if (from === null || to === null) return null
  const total = (to - from + 1440) % 1440
  const hours = Math.floor(total / 60)
  const minutes = total % 60
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`
}

export function QuietHoursCard() {
  const [start, setStart] = React.useState(DEFAULT_START)
  const [end, setEnd] = React.useState(DEFAULT_END)
  const span = quietSpan(start, end)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiet hours</CardTitle>
        <CardDescription>
          Pause email and push notifications overnight.
        </CardDescription>
        <CardAction>
          <Badge variant="secondary">
            <MoonIcon />
            {span ?? "Off"}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Label id="quiet-start-label">From</Label>
            <TimeField
              aria-labelledby="quiet-start-label"
              value={start}
              onValueChange={setStart}
              hourCycle={12}
              minuteStep={15}
            />
          </div>
          <div className="grid gap-2">
            <Label id="quiet-end-label">Until</Label>
            <TimeField
              aria-labelledby="quiet-end-label"
              value={end}
              onValueChange={setEnd}
              hourCycle={12}
              minuteStep={15}
            />
          </div>
        </div>
        <div className="grid gap-2 rounded-md bg-muted px-3 py-2.5">
          <span className="text-xs font-medium">Still delivered</span>
          <ul className="grid gap-1 text-xs text-muted-foreground">
            {STILL_DELIVERED.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          Times in Europe/Lisbon
        </span>
        <Button size="sm">Save</Button>
      </CardFooter>
    </Card>
  )
}
