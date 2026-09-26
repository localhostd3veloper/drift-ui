"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/registry/default/lib/utils"
import { Button } from "@/registry/default/ui/button"
import { Calendar } from "@/registry/default/ui/calendar"
import { Input } from "@/registry/default/ui/input"
import { Label } from "@/registry/default/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover"

type DateTimeRange = {
  from?: Date
  to?: Date
}

const DEFAULT_START_TIME = "09:00"
const DEFAULT_END_TIME = "17:00"

function timeOf(date: Date | undefined, fallback: string) {
  if (!date) return fallback
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
}

function withTime(date: Date | undefined, time: string) {
  if (!date) return undefined
  const [hours = 0, minutes = 0] = time.split(":").map(Number)
  const next = new Date(date)
  next.setHours(hours, minutes, 0, 0)
  return next
}

function formatRange(range: DateTimeRange, locale?: string) {
  const formatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  })
  if (range.from && range.to) return formatter.formatRange(range.from, range.to)
  if (range.from) return formatter.format(range.from)
  return null
}

function DateTimeRangePicker({
  value,
  defaultValue = {},
  onValueChange,
  locale,
  placeholder = "Pick a date range",
  numberOfMonths = 2,
  disabled,
  className,
  id,
}: {
  value?: DateTimeRange
  defaultValue?: DateTimeRange
  onValueChange?: (range: DateTimeRange) => void
  locale?: string
  placeholder?: string
  numberOfMonths?: number
  disabled?: boolean
  className?: string
  id?: string
}) {
  const [uncontrolledRange, setUncontrolledRange] = React.useState(defaultValue)
  const [isOpen, setIsOpen] = React.useState(false)
  const range = value ?? uncontrolledRange
  const startTime = timeOf(range.from, DEFAULT_START_TIME)
  const endTime = timeOf(range.to, DEFAULT_END_TIME)
  const label = formatRange(range, locale)
  const timeFieldId = React.useId()

  function updateRange(next: DateTimeRange) {
    if (value === undefined) setUncontrolledRange(next)
    onValueChange?.(next)
  }

  function selectDays(days: DateRange | undefined) {
    updateRange({
      from: withTime(days?.from, startTime),
      to: withTime(days?.to, endTime),
    })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          disabled={disabled}
          data-slot="date-time-range"
          data-empty={label ? undefined : ""}
          className={cn(
            "w-full max-w-sm justify-start font-normal data-[empty]:text-muted-foreground",
            className
          )}
        >
          <CalendarIcon />
          <span className="truncate">{label ?? placeholder}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="range"
          numberOfMonths={numberOfMonths}
          defaultMonth={range.from}
          selected={{ from: range.from, to: range.to }}
          onSelect={selectDays}
        />
        <div className="grid grid-cols-2 gap-3 border-t p-3">
          <div className="grid gap-1.5">
            <Label htmlFor={`${timeFieldId}-start`}>Start time</Label>
            <Input
              id={`${timeFieldId}-start`}
              type="time"
              value={startTime}
              disabled={!range.from}
              onChange={(event) =>
                updateRange({
                  ...range,
                  from: withTime(range.from, event.target.value),
                })
              }
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`${timeFieldId}-end`}>End time</Label>
            <Input
              id={`${timeFieldId}-end`}
              type="time"
              value={endTime}
              disabled={!range.to}
              onChange={(event) =>
                updateRange({
                  ...range,
                  to: withTime(range.to, event.target.value),
                })
              }
            />
          </div>
        </div>
        <div className="flex justify-between gap-2 border-t p-3">
          <Button variant="ghost" size="sm" onClick={() => updateRange({})}>
            Clear
          </Button>
          <Button size="sm" onClick={() => setIsOpen(false)}>
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { DateTimeRangePicker, type DateTimeRange }
