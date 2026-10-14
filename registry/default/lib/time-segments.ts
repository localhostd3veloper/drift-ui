export type TimeSegment = "hour" | "minute" | "period"
export type HourCycle = 12 | 24
export type TimeOfDay = { hours: number; minutes: number }

export const MIDNIGHT: TimeOfDay = { hours: 0, minutes: 0 }

const SEGMENT_LABEL: Record<TimeSegment, string> = {
  hour: "Hours",
  minute: "Minutes",
  period: "AM/PM",
}

function padTwo(value: number) {
  return String(value).padStart(2, "0")
}

export function segmentLabel(segment: TimeSegment) {
  return SEGMENT_LABEL[segment]
}

export function segmentRange(segment: TimeSegment, hourCycle: HourCycle) {
  switch (segment) {
    case "hour":
      return hourCycle === 12 ? { min: 1, max: 12 } : { min: 0, max: 23 }
    case "minute":
      return { min: 0, max: 59 }
    case "period":
      return { min: 0, max: 1 }
  }
}

export function parseTimeOfDay(value: string): TimeOfDay | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value)
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23 || minutes > 59) return null
  return { hours, minutes }
}

export function formatTimeOfDay({ hours, minutes }: TimeOfDay) {
  return `${padTwo(hours)}:${padTwo(minutes)}`
}

export function readSegment(
  time: TimeOfDay,
  segment: TimeSegment,
  hourCycle: HourCycle
) {
  switch (segment) {
    case "hour":
      return hourCycle === 12 ? time.hours % 12 || 12 : time.hours
    case "minute":
      return time.minutes
    case "period":
      return time.hours >= 12 ? 1 : 0
  }
}

export function writeSegment(
  time: TimeOfDay,
  segment: TimeSegment,
  segmentValue: number,
  hourCycle: HourCycle
): TimeOfDay {
  const isAfternoon = time.hours >= 12
  switch (segment) {
    case "hour":
      if (hourCycle === 24) return { ...time, hours: segmentValue }
      return { ...time, hours: (segmentValue % 12) + (isAfternoon ? 12 : 0) }
    case "minute":
      return { ...time, minutes: segmentValue }
    case "period":
      return { ...time, hours: (time.hours % 12) + segmentValue * 12 }
  }
}

export function stepSegment(
  time: TimeOfDay,
  segment: TimeSegment,
  delta: number,
  hourCycle: HourCycle
) {
  const { min, max } = segmentRange(segment, hourCycle)
  const size = max - min + 1
  const current = readSegment(time, segment, hourCycle)
  const wrapped = min + ((((current - min + delta) % size) + size) % size)
  return writeSegment(time, segment, wrapped, hourCycle)
}

export function segmentText(
  time: TimeOfDay | null,
  segment: TimeSegment,
  hourCycle: HourCycle
) {
  if (segment === "period") {
    if (!time) return "--"
    return readSegment(time, segment, hourCycle) === 1 ? "PM" : "AM"
  }
  if (!time) return "--"
  return padTwo(readSegment(time, segment, hourCycle))
}
