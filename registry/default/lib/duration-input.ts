export type DurationUnit = "w" | "d" | "h" | "m" | "s" | "ms"

export const UNIT_ORDER: DurationUnit[] = ["w", "d", "h", "m", "s", "ms"]

export const UNIT_MS: Record<DurationUnit, number> = {
  w: 7 * 24 * 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
  h: 60 * 60 * 1000,
  m: 60 * 1000,
  s: 1000,
  ms: 1,
}

export const UNIT_LABELS: Record<
  DurationUnit,
  { singular: string; plural: string }
> = {
  w: { singular: "Weeks", plural: "Weeks" },
  d: { singular: "Days", plural: "Days" },
  h: { singular: "Hours", plural: "Hours" },
  m: { singular: "Minutes", plural: "Minutes" },
  s: { singular: "Seconds", plural: "Seconds" },
  ms: { singular: "Milliseconds", plural: "Milliseconds" },
}

export function sortUnits(units: DurationUnit[]): DurationUnit[] {
  return [...units].sort(
    (a, b) => UNIT_ORDER.indexOf(a) - UNIT_ORDER.indexOf(b)
  )
}

export function unitLabel(unit: DurationUnit): string {
  return UNIT_LABELS[unit]?.singular ?? unit
}

export function decomposeDuration(
  ms: number | null | undefined,
  units: DurationUnit[]
): Record<DurationUnit, number> | null {
  if (ms === null || ms === undefined || Number.isNaN(ms)) {
    return null
  }

  const sorted = sortUnits(units)
  const result = {} as Record<DurationUnit, number>
  let remainder = Math.max(0, ms)

  for (let i = 0; i < sorted.length; i++) {
    const unit = sorted[i]
    const unitSize = UNIT_MS[unit]
    const isSmallest = i === sorted.length - 1

    if (isSmallest) {
      result[unit] = Math.floor(remainder / unitSize)
      remainder = remainder % unitSize
    } else {
      const count = Math.floor(remainder / unitSize)
      result[unit] = count
      remainder = remainder % unitSize
    }
  }

  return result
}

export function composeDuration(
  parts: Partial<Record<DurationUnit, number>>
): number {
  let total = 0
  for (const [key, val] of Object.entries(parts)) {
    const unit = key as DurationUnit
    if (UNIT_MS[unit] && typeof val === "number" && !Number.isNaN(val)) {
      total += Math.max(0, val) * UNIT_MS[unit]
    }
  }
  return total
}

const ISO_8601_REGEX =
  /^P(?:(\d+(?:[.,]\d+)?)W)?(?:(\d+(?:[.,]\d+)?)D)?(?:T(?:(\d+(?:[.,]\d+)?)H)?(?:(\d+(?:[.,]\d+)?)M)?(?:(\d+(?:[.,]\d+)?)S)?)?$/i

const UNIT_TOKEN_REGEX =
  /(\d+(?:[.,]\d+)?)\s*(milliseconds?|millis?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w)(?![a-zA-Z])/gi

function normalizeUnitName(raw: string): DurationUnit | null {
  const lower = raw.toLowerCase()
  if (lower === "w" || lower === "week" || lower === "weeks") return "w"
  if (lower === "d" || lower === "day" || lower === "days") return "d"
  if (
    lower === "h" ||
    lower === "hr" ||
    lower === "hrs" ||
    lower === "hour" ||
    lower === "hours"
  )
    return "h"
  if (
    lower === "m" ||
    lower === "min" ||
    lower === "mins" ||
    lower === "minute" ||
    lower === "minutes"
  )
    return "m"
  if (
    lower === "s" ||
    lower === "sec" ||
    lower === "secs" ||
    lower === "second" ||
    lower === "seconds"
  )
    return "s"
  if (
    lower === "ms" ||
    lower === "milli" ||
    lower === "millis" ||
    lower === "millisecond" ||
    lower === "milliseconds"
  )
    return "ms"
  return null
}

export function parseDurationString(
  input: string,
  fallbackUnit: DurationUnit = "m"
): number | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  // ISO 8601 duration check (e.g. PT1H30M, P2DT4H, PT90M)
  const isoMatch = ISO_8601_REGEX.exec(trimmed)
  if (
    isoMatch &&
    (isoMatch[1] || isoMatch[2] || isoMatch[3] || isoMatch[4] || isoMatch[5])
  ) {
    const weeks = isoMatch[1] ? Number(isoMatch[1].replace(",", ".")) : 0
    const days = isoMatch[2] ? Number(isoMatch[2].replace(",", ".")) : 0
    const hours = isoMatch[3] ? Number(isoMatch[3].replace(",", ".")) : 0
    const minutes = isoMatch[4] ? Number(isoMatch[4].replace(",", ".")) : 0
    const seconds = isoMatch[5] ? Number(isoMatch[5].replace(",", ".")) : 0

    return Math.round(
      weeks * UNIT_MS.w +
        days * UNIT_MS.d +
        hours * UNIT_MS.h +
        minutes * UNIT_MS.m +
        seconds * UNIT_MS.s
    )
  }

  // Token regex for shorthand like "1h 30m", "90m", "2d 4h", "1.5h"
  let matched = false
  let totalMs = 0
  let match: RegExpExecArray | null

  UNIT_TOKEN_REGEX.lastIndex = 0
  while ((match = UNIT_TOKEN_REGEX.exec(trimmed)) !== null) {
    matched = true
    const value = Number(match[1].replace(",", "."))
    const unit = normalizeUnitName(match[2])
    if (unit && !Number.isNaN(value)) {
      totalMs += value * UNIT_MS[unit]
    }
  }

  if (matched) {
    return Math.round(totalMs)
  }

  // Bare number input (e.g. "90")
  if (/^\d+(?:[.,]\d+)?$/.test(trimmed)) {
    const value = Number(trimmed.replace(",", "."))
    if (!Number.isNaN(value)) {
      return Math.round(value * UNIT_MS[fallbackUnit])
    }
  }

  return null
}

export function formatDuration(
  ms: number | null | undefined,
  units: DurationUnit[] = ["h", "m"]
): string {
  if (ms === null || ms === undefined || Number.isNaN(ms)) {
    return ""
  }

  const parts = decomposeDuration(ms, units)
  if (!parts) return ""

  const sorted = sortUnits(units)
  const nonZero = sorted.filter((unit) => (parts[unit] ?? 0) > 0)

  if (nonZero.length === 0) {
    const smallest = sorted[sorted.length - 1]
    return `0${smallest}`
  }

  return nonZero.map((unit) => `${parts[unit]}${unit}`).join(" ")
}

export function segmentRange(
  unit: DurationUnit,
  units: DurationUnit[],
  max?: number
): { min: number; max: number } {
  const sorted = sortUnits(units)
  const unitIndex = sorted.indexOf(unit)

  if (unitIndex === 0) {
    // Largest unit: bounded by max if provided, otherwise 999
    return {
      min: 0,
      max: max !== undefined ? Math.floor(max / UNIT_MS[unit]) : 999,
    }
  }

  const parentUnit = sorted[unitIndex - 1]
  const parentRatio = Math.floor(UNIT_MS[parentUnit] / UNIT_MS[unit]) - 1

  return {
    min: 0,
    max: Math.max(1, parentRatio),
  }
}

export function readSegment(
  ms: number | null | undefined,
  unit: DurationUnit,
  units: DurationUnit[]
): number {
  if (ms === null || ms === undefined) return 0
  const parts = decomposeDuration(ms, units)
  return parts?.[unit] ?? 0
}

export function writeSegment(
  ms: number | null | undefined,
  unit: DurationUnit,
  segmentValue: number,
  units: DurationUnit[],
  max?: number,
  min: number = 0
): number {
  const currentMs = ms ?? 0
  const currentUnitVal = readSegment(currentMs, unit, units)
  const delta = (segmentValue - currentUnitVal) * UNIT_MS[unit]
  const nextMs = currentMs + delta

  return Math.min(max ?? Infinity, Math.max(min, nextMs))
}

export function stepSegment(
  ms: number | null | undefined,
  unit: DurationUnit,
  delta: number,
  units: DurationUnit[],
  max?: number,
  min: number = 0
): number {
  const currentMs = ms ?? 0
  const nextMs = currentMs + delta * UNIT_MS[unit]
  return Math.min(max ?? Infinity, Math.max(min, nextMs))
}

export function segmentText(
  ms: number | null | undefined,
  unit: DurationUnit,
  units: DurationUnit[]
): string {
  if (ms === null || ms === undefined) {
    return "--"
  }

  const value = readSegment(ms, unit, units)

  if (unit === "ms") {
    return String(value).padStart(3, "0")
  }
  if (unit === "w" || unit === "d") {
    return String(value)
  }

  return String(value).padStart(2, "0")
}
