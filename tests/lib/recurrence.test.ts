import { describe, expect, it } from "vitest"

import {
  describeRecurrence,
  formatRRule,
  occurrences,
  parseRRule,
} from "@/registry/default/lib/recurrence"

const TUESDAY = new Date(2026, 10, 3, 10, 0)

function days(rule: string, start: Date, limit: number) {
  return occurrences(parseRRule(rule), start, limit).map(
    (date) =>
      `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`
  )
}

describe("recurrence", () => {
  it("parses an RRULE, with or without the RRULE: prefix", () => {
    expect(
      parseRRule("RRULE:FREQ=MONTHLY;INTERVAL=2;BYDAY=-1FR;COUNT=10")
    ).toEqual({
      frequency: "MONTHLY",
      interval: 2,
      byDay: [{ weekday: "FR", ordinal: -1 }],
      byMonthDay: [],
      count: 10,
      until: undefined,
    })
    expect(parseRRule("freq=daily;bymonthday=15,-1").byMonthDay).toEqual([
      15, -1,
    ])
  })

  it("falls back to weekly every 1 for missing or invalid parts", () => {
    expect(parseRRule("FREQ=HOURLY;INTERVAL=0;BYDAY=XX;COUNT=-2")).toEqual({
      frequency: "WEEKLY",
      interval: 1,
      byDay: [],
      byMonthDay: [],
      count: undefined,
      until: undefined,
    })
  })

  it("reads UNTIL as a UTC date-time or a local end of day", () => {
    expect(parseRRule("FREQ=DAILY;UNTIL=20261231T120000Z").until).toEqual(
      new Date(Date.UTC(2026, 11, 31, 12))
    )
    expect(parseRRule("FREQ=DAILY;UNTIL=20261231").until).toEqual(
      new Date(2026, 11, 31, 23, 59, 59)
    )
  })

  it("formats in a stable order and round-trips", () => {
    const rule = "FREQ=WEEKLY;INTERVAL=2;BYDAY=TU,TH;COUNT=4"
    expect(formatRRule(parseRRule(rule))).toBe(rule)
    expect(formatRRule(parseRRule("INTERVAL=1;FREQ=DAILY"))).toBe("FREQ=DAILY")
    expect(formatRRule(parseRRule("FREQ=DAILY;UNTIL=20261231T120000Z"))).toBe(
      "FREQ=DAILY;UNTIL=20261231T120000Z"
    )
  })

  it("describes rules in plain language", () => {
    const describe = (rule: string) =>
      describeRecurrence(parseRRule(rule), TUESDAY)
    expect(describe("FREQ=DAILY")).toBe("Daily")
    expect(describe("FREQ=WEEKLY;INTERVAL=2;BYDAY=TU")).toBe(
      "Every 2 weeks on Tuesday"
    )
    expect(describe("FREQ=WEEKLY;BYDAY=FR,MO,WE")).toBe(
      "Weekly on Monday, Wednesday and Friday"
    )
    expect(describe("FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;UNTIL=20261231")).toBe(
      "Every weekday until Dec 31, 2026"
    )
    expect(describe("FREQ=MONTHLY;BYDAY=-1FR;COUNT=10")).toBe(
      "Monthly on the last Friday, 10 times"
    )
    expect(describe("FREQ=MONTHLY;BYDAY=2TU")).toBe(
      "Monthly on the second Tuesday"
    )
    expect(describe("FREQ=MONTHLY;INTERVAL=3")).toBe("Every 3 months on day 3")
    expect(describe("FREQ=MONTHLY;BYMONTHDAY=-1;COUNT=1")).toBe(
      "Monthly on the last day, once"
    )
    expect(describe("FREQ=YEARLY")).toBe("Yearly on November 3")
  })

  it("lists daily and weekly occurrences from the start, keeping its time", () => {
    expect(days("FREQ=DAILY;INTERVAL=3", TUESDAY, 3)).toEqual([
      "2026-11-3 10:00",
      "2026-11-6 10:00",
      "2026-11-9 10:00",
    ])
    expect(days("FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,TU", TUESDAY, 3)).toEqual([
      "2026-11-3 10:00",
      "2026-11-16 10:00",
      "2026-11-17 10:00",
    ])
  })

  it("lists monthly occurrences by ordinal weekday and by month day", () => {
    expect(days("FREQ=MONTHLY;BYDAY=-1FR", TUESDAY, 3)).toEqual([
      "2026-11-27 10:00",
      "2026-12-25 10:00",
      "2027-1-29 10:00",
    ])
    expect(days("FREQ=MONTHLY;BYDAY=2TU", TUESDAY, 2)).toEqual([
      "2026-11-10 10:00",
      "2026-12-8 10:00",
    ])
    expect(days("FREQ=MONTHLY;BYMONTHDAY=31", TUESDAY, 2)).toEqual([
      "2026-12-31 10:00",
      "2027-1-31 10:00",
    ])
  })

  it("lists yearly occurrences on the start date", () => {
    expect(days("FREQ=YEARLY;INTERVAL=2", TUESDAY, 2)).toEqual([
      "2026-11-3 10:00",
      "2028-11-3 10:00",
    ])
  })

  it("stops at COUNT and UNTIL", () => {
    expect(days("FREQ=DAILY;COUNT=2", TUESDAY, 5)).toHaveLength(2)
    expect(days("FREQ=DAILY;UNTIL=20261105", TUESDAY, 5)).toEqual([
      "2026-11-3 10:00",
      "2026-11-4 10:00",
      "2026-11-5 10:00",
    ])
  })
})
