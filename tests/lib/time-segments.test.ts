import { describe, expect, it } from "vitest"

import {
  formatTimeOfDay,
  parseTimeOfDay,
  readSegment,
  segmentText,
  stepSegment,
  writeSegment,
} from "@/registry/default/lib/time-segments"

describe("time segments", () => {
  it("parses valid HH:mm strings and rejects invalid ones", () => {
    expect(parseTimeOfDay("09:30")).toEqual({ hours: 9, minutes: 30 })
    expect(parseTimeOfDay("7:05")).toEqual({ hours: 7, minutes: 5 })
    expect(parseTimeOfDay("24:00")).toBeNull()
    expect(parseTimeOfDay("12:60")).toBeNull()
    expect(parseTimeOfDay("")).toBeNull()
  })

  it("formats with zero padding", () => {
    expect(formatTimeOfDay({ hours: 7, minutes: 5 })).toBe("07:05")
  })

  it("reads hours on a 12 hour clock with 12 for noon and midnight", () => {
    expect(readSegment({ hours: 0, minutes: 0 }, "hour", 12)).toBe(12)
    expect(readSegment({ hours: 12, minutes: 0 }, "hour", 12)).toBe(12)
    expect(readSegment({ hours: 15, minutes: 0 }, "hour", 12)).toBe(3)
    expect(readSegment({ hours: 15, minutes: 0 }, "period", 12)).toBe(1)
  })

  it("writes 12 hour values while keeping the period", () => {
    const afternoon = { hours: 15, minutes: 0 }
    expect(writeSegment(afternoon, "hour", 12, 12)).toEqual({
      hours: 12,
      minutes: 0,
    })
    expect(writeSegment(afternoon, "hour", 9, 12)).toEqual({
      hours: 21,
      minutes: 0,
    })
    expect(writeSegment(afternoon, "period", 0, 12)).toEqual({
      hours: 3,
      minutes: 0,
    })
  })

  it("wraps when stepping past the ends of a segment", () => {
    expect(stepSegment({ hours: 23, minutes: 0 }, "hour", 1, 24)).toEqual({
      hours: 0,
      minutes: 0,
    })
    expect(stepSegment({ hours: 0, minutes: 0 }, "minute", -1, 24)).toEqual({
      hours: 0,
      minutes: 59,
    })
  })

  it("shows placeholders for an empty value", () => {
    expect(segmentText(null, "hour", 24)).toBe("--")
    expect(segmentText({ hours: 13, minutes: 0 }, "period", 12)).toBe("PM")
  })
})
