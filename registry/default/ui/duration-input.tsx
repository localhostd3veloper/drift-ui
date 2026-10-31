"use client"

import * as React from "react"

import { useControllableState } from "@/registry/default/hooks/use-controllable-state"
import {
  type DurationUnit,
  parseDurationString,
  readSegment,
  segmentRange,
  segmentText,
  sortUnits,
  stepSegment,
  unitLabel,
  writeSegment,
} from "@/registry/default/lib/duration-input"
import { cn } from "@/registry/default/lib/utils"

const TYPEAHEAD_RESET_MS = 1000

const DEFAULT_UNITS: DurationUnit[] = ["h", "m", "s"]

type TypedDigits = {
  unit: DurationUnit
  digits: string
  typedAtMs: number
}

interface DurationInputProps extends Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> {
  value?: number | null
  defaultValue?: number | null
  onValueChange?: (value: number | null) => void
  units?: DurationUnit[]
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  name?: string
}

function DurationInput({
  value,
  defaultValue = null,
  onValueChange,
  units = DEFAULT_UNITS,
  min = 0,
  max,
  step = 1,
  disabled,
  name,
  className,
  ...props
}: DurationInputProps) {
  const { value: durationValue, setValue: setDurationValue } =
    useControllableState<number | null>({
      value,
      defaultValue,
      onChange: onValueChange,
    })

  const orderedUnits = React.useMemo(() => sortUnits(units), [units])
  const segmentRefs = React.useRef<(HTMLSpanElement | null)[]>([])
  const typedDigitsRef = React.useRef<TypedDigits | null>(null)
  const lastTypedRef = React.useRef<TypedDigits | null>(null)

  function commit(next: number | null) {
    if (next === null) {
      setDurationValue(null)
      return
    }
    const clamped = Math.min(max ?? Infinity, Math.max(min, next))
    setDurationValue(clamped)
  }

  function focusSegment(index: number) {
    if (index >= 0 && index < orderedUnits.length) {
      segmentRefs.current[index]?.focus()
    }
  }

  function focusUnit(targetUnit: DurationUnit) {
    const index = orderedUnits.indexOf(targetUnit)
    if (index !== -1) {
      focusSegment(index)
    }
  }

  function typeDigit(
    unit: DurationUnit,
    index: number,
    digit: string,
    typedAtMs: number
  ) {
    const previous = typedDigitsRef.current
    const isContinuing =
      previous?.unit === unit &&
      typedAtMs - previous.typedAtMs < TYPEAHEAD_RESET_MS
    const combined = isContinuing ? previous.digits + digit : digit
    const typedValue = Number(combined)
    const maxDigits = unit === "ms" ? 3 : 2
    const isComplete = combined.length >= maxDigits

    typedDigitsRef.current = isComplete
      ? null
      : { unit, digits: combined, typedAtMs }
    lastTypedRef.current = { unit, digits: combined, typedAtMs }

    commit(
      writeSegment(durationValue, unit, typedValue, orderedUnits, max, min)
    )

    if (isComplete) {
      focusSegment(index + 1)
    }
  }

  function handleKeyDown(
    unit: DurationUnit,
    index: number,
    event: React.KeyboardEvent<HTMLSpanElement>
  ) {
    if (disabled) return

    switch (event.key) {
      case "ArrowUp":
      case "ArrowDown": {
        event.preventDefault()
        const delta = event.key === "ArrowUp" ? step : -step
        commit(stepSegment(durationValue, unit, delta, orderedUnits, max, min))
        return
      }
      case "PageUp":
      case "PageDown": {
        event.preventDefault()
        const delta = event.key === "PageUp" ? step * 10 : -step * 10
        commit(stepSegment(durationValue, unit, delta, orderedUnits, max, min))
        return
      }
      case "Home": {
        event.preventDefault()
        commit(writeSegment(durationValue, unit, 0, orderedUnits, max, min))
        return
      }
      case "End": {
        event.preventDefault()
        const { max: segMax } = segmentRange(unit, orderedUnits, max)
        commit(
          writeSegment(durationValue, unit, segMax, orderedUnits, max, min)
        )
        return
      }
      case "ArrowLeft":
      case "ArrowRight": {
        event.preventDefault()
        focusSegment(event.key === "ArrowLeft" ? index - 1 : index + 1)
        return
      }
      case "Backspace":
      case "Delete": {
        event.preventDefault()
        if (typedDigitsRef.current) {
          typedDigitsRef.current = null
          lastTypedRef.current = null
          commit(writeSegment(durationValue, unit, 0, orderedUnits, max, min))
        } else {
          lastTypedRef.current = null
          commit(null)
        }
        return
      }
    }

    // Direct unit shortcut key (e.g. pressing 'h', 'm', 's', 'd', 'w')
    const keyLower = event.key.toLowerCase() as DurationUnit
    if (orderedUnits.includes(keyLower)) {
      event.preventDefault()
      const recent = typedDigitsRef.current ?? lastTypedRef.current
      const isRecent =
        recent && event.timeStamp - recent.typedAtMs < TYPEAHEAD_RESET_MS

      if (isRecent && recent) {
        const val = Number(recent.digits)
        typedDigitsRef.current = null
        lastTypedRef.current = null

        if (recent.unit !== keyLower) {
          const cleared = writeSegment(
            durationValue,
            recent.unit,
            0,
            orderedUnits,
            max,
            min
          )
          commit(writeSegment(cleared, keyLower, val, orderedUnits, max, min))
        } else {
          commit(
            writeSegment(durationValue, keyLower, val, orderedUnits, max, min)
          )
        }
      }
      focusUnit(keyLower)
      return
    }

    // Digits entry
    if (/^\d$/.test(event.key)) {
      event.preventDefault()
      typeDigit(unit, index, event.key, event.timeStamp)
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLDivElement>) {
    if (disabled) return
    const text = event.clipboardData.getData("text")
    const parsed = parseDurationString(text, orderedUnits[0] ?? "m")
    if (parsed !== null) {
      event.preventDefault()
      commit(parsed)
    }
  }

  return (
    <div
      role="group"
      data-slot="duration-input"
      data-disabled={disabled ? "" : undefined}
      onPaste={handlePaste}
      className={cn(
        "inline-flex h-9 w-fit items-center rounded-md border border-input bg-transparent px-2 font-mono text-sm tabular-nums shadow-xs transition-[color,box-shadow] dark:bg-input/30",
        "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      {orderedUnits.map((unit, index) => {
        const { min: segMin, max: segMax } = segmentRange(
          unit,
          orderedUnits,
          max
        )
        const text = segmentText(durationValue, unit, orderedUnits)
        const currentVal =
          durationValue !== null && durationValue !== undefined
            ? readSegment(durationValue, unit, orderedUnits)
            : undefined

        return (
          <React.Fragment key={unit}>
            <span
              ref={(node) => {
                segmentRefs.current[index] = node
              }}
              role="spinbutton"
              tabIndex={disabled ? -1 : 0}
              data-slot="duration-input-segment"
              data-placeholder={durationValue === null ? "" : undefined}
              aria-label={unitLabel(unit)}
              aria-valuemin={segMin}
              aria-valuemax={segMax}
              aria-valuenow={currentVal}
              aria-valuetext={
                durationValue !== null
                  ? `${currentVal ?? 0} ${unitLabel(unit)}`
                  : "Empty"
              }
              onKeyDown={(event) => handleKeyDown(unit, index, event)}
              onBlur={() => {
                typedDigitsRef.current = null
              }}
              className="rounded-sm px-0.5 outline-none select-none focus:bg-accent focus:text-accent-foreground data-placeholder:text-muted-foreground"
            >
              {text}
            </span>
            <span
              aria-hidden="true"
              className="mr-1.5 text-muted-foreground select-none last:mr-0"
            >
              {unit}
            </span>
          </React.Fragment>
        )
      })}
      {name && (
        <input
          type="hidden"
          name={name}
          value={
            durationValue !== null && durationValue !== undefined
              ? durationValue
              : ""
          }
        />
      )}
    </div>
  )
}

export { DurationInput, type DurationInputProps }
