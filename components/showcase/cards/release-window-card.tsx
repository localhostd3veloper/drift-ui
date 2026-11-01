"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { CalendarIcon, RocketIcon } from "lucide-react"

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
import type { DateTimeRange } from "@/registry/default/ui/date-time-range"
import { Label } from "@/registry/default/ui/label"
import { useHasHydrated } from "@/hooks/use-has-hydrated"

const LOCALE = "en-US"
const PICKER_ID = "release-window"
const PICKER_PLACEHOLDER = "Pick a start and end"

function PickerPlaceholder() {
  return (
    <Button
      id={PICKER_ID}
      variant="outline"
      className="w-full justify-start font-normal text-muted-foreground"
    >
      <CalendarIcon />
      <span className="truncate">{PICKER_PLACEHOLDER}</span>
    </Button>
  )
}

const DateTimeRangePicker = dynamic(
  () =>
    import("@/registry/default/ui/date-time-range").then(
      (module) => module.DateTimeRangePicker
    ),
  { ssr: false, loading: PickerPlaceholder }
)

const DEFAULT_WINDOW: DateTimeRange = {
  from: new Date(2026, 10, 12, 22, 0),
  to: new Date(2026, 10, 13, 1, 30),
}

const pointFormatter = new Intl.DateTimeFormat(LOCALE, {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
})

function formatDuration(range: DateTimeRange) {
  if (!range.from || !range.to) return "Not set"
  const minutes = Math.max(
    0,
    Math.round((range.to.getTime() - range.from.getTime()) / 60000)
  )
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest}m`
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`
}

function formatPoint(date: Date | undefined) {
  return date ? pointFormatter.format(date) : "Not set"
}

export function ReleaseWindowCard() {
  const [chosenRange, setRange] = React.useState<DateTimeRange>(DEFAULT_WINDOW)
  const hasHydrated = useHasHydrated()
  const range = hasHydrated ? chosenRange : {}
  const isComplete = Boolean(range.from && range.to)

  const summary = [
    { label: "Starts", value: formatPoint(range.from) },
    { label: "Ends", value: formatPoint(range.to) },
    { label: "Duration", value: formatDuration(range) },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Release window</CardTitle>
        <CardDescription>v2.14.0 to production, eu-west-1</CardDescription>
        <CardAction>
          <Badge variant={isComplete ? "secondary" : "outline"}>
            {isComplete ? "Scheduled" : "Draft"}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor={PICKER_ID}>Deploy window</Label>
          <DateTimeRangePicker
            id={PICKER_ID}
            value={range}
            onValueChange={setRange}
            locale={LOCALE}
            numberOfMonths={1}
            placeholder={PICKER_PLACEHOLDER}
            className="max-w-none min-w-0"
          />
        </div>
        <dl className="grid grid-cols-3 divide-x rounded-md border text-sm">
          {summary.map((item) => (
            <div key={item.label} className="flex flex-col gap-1 px-3 py-2.5">
              <dt className="text-xs text-muted-foreground">{item.label}</dt>
              <dd className="font-medium tabular-nums">{item.value}</dd>
            </div>
          ))}
        </dl>
        <p className="text-xs text-muted-foreground">
          Checkout and webhooks stay live. Admin writes pause for up to 5
          minutes during the schema migration.
        </p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => setRange({})}>
          Clear
        </Button>
        <Button size="sm" disabled={!isComplete}>
          <RocketIcon />
          Schedule deploy
        </Button>
      </CardFooter>
    </Card>
  )
}
