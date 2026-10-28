export type Frequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY"

export type Weekday = "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU"

export type WeekdayRule = { weekday: Weekday; ordinal?: number }

export type Recurrence = {
  frequency: Frequency
  interval: number
  byDay: WeekdayRule[]
  byMonthDay: number[]
  count?: number
  until?: Date
}

export const FREQUENCIES: Frequency[] = ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]

export const WEEKDAYS: Weekday[] = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"]

export const WEEKDAY_NAMES: Record<Weekday, string> = {
  MO: "Monday",
  TU: "Tuesday",
  WE: "Wednesday",
  TH: "Thursday",
  FR: "Friday",
  SA: "Saturday",
  SU: "Sunday",
}

const UNITS: Record<Frequency, string> = {
  DAILY: "day",
  WEEKLY: "week",
  MONTHLY: "month",
  YEARLY: "year",
}

const ADVERBS: Record<Frequency, string> = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
}

const ORDINALS: Record<number, string> = {
  1: "first",
  2: "second",
  3: "third",
  4: "fourth",
  5: "fifth",
  [-1]: "last",
  [-2]: "second to last",
}

const BY_DAY = /^([+-]?\d{1,2})?(MO|TU|WE|TH|FR|SA|SU)$/
const UNTIL = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/
const DAY_MS = 86_400_000
const SEARCH_LIMIT_DAYS = 366 * 100
const SUMMARY_DATE = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" })

function positiveInteger(text: string | undefined) {
  const parsed = Number(text)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined
}

function parseByDay(text = ""): WeekdayRule[] {
  return text.split(",").flatMap((part) => {
    const match = BY_DAY.exec(part)
    if (!match) return []
    const [, ordinal, weekday] = match
    return [
      ordinal
        ? { weekday: weekday as Weekday, ordinal: Number(ordinal) }
        : { weekday: weekday as Weekday },
    ]
  })
}

function parseUntil(text = "") {
  const match = UNTIL.exec(text)
  if (!match) return undefined
  const [
    ,
    year,
    month,
    day,
    hours = "23",
    minutes = "59",
    seconds = "59",
    utc,
  ] = match
  const fields = [
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
    Number(seconds),
  ] as const
  return utc ? new Date(Date.UTC(...fields)) : new Date(...fields)
}

export function parseRRule(rule: string): Recurrence {
  const parts = new Map(
    rule
      .trim()
      .replace(/^RRULE:/i, "")
      .split(";")
      .map((part) => {
        const [key, value = ""] = part.split("=")
        return [key.trim().toUpperCase(), value.trim().toUpperCase()] as const
      })
  )
  const frequency = parts.get("FREQ") as Frequency
  return {
    frequency: FREQUENCIES.includes(frequency) ? frequency : "WEEKLY",
    interval: positiveInteger(parts.get("INTERVAL")) ?? 1,
    byDay: parseByDay(parts.get("BYDAY")),
    byMonthDay: (parts.get("BYMONTHDAY") ?? "")
      .split(",")
      .map(Number)
      .filter(
        (day) => Number.isInteger(day) && day !== 0 && Math.abs(day) <= 31
      ),
    count: positiveInteger(parts.get("COUNT")),
    until: parseUntil(parts.get("UNTIL")),
  }
}

export function formatRRule(recurrence: Recurrence) {
  const { frequency, interval, byDay, byMonthDay, count, until } = recurrence
  const parts = [`FREQ=${frequency}`]
  if (interval > 1) parts.push(`INTERVAL=${interval}`)
  if (byDay.length > 0) {
    parts.push(
      `BYDAY=${byDay.map((rule) => `${rule.ordinal ?? ""}${rule.weekday}`).join(",")}`
    )
  }
  if (byMonthDay.length > 0) parts.push(`BYMONTHDAY=${byMonthDay.join(",")}`)
  if (count) parts.push(`COUNT=${count}`)
  else if (until) {
    parts.push(
      `UNTIL=${until
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "")}`
    )
  }
  return parts.join(";")
}

export function weekdayOf(date: Date): Weekday {
  return WEEKDAYS[(date.getDay() + 6) % 7]
}

export function ordinalWeekOf(date: Date) {
  return Math.ceil(date.getDate() / 7)
}

export function isLastWeekOf(date: Date) {
  return date.getDate() + 7 > daysInMonth(date)
}

function daysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

function dayNumber(date: Date) {
  return Math.round(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS
  )
}

function weekdaysOf(recurrence: Recurrence, start: Date) {
  return recurrence.byDay.length > 0
    ? recurrence.byDay.map((rule) => rule.weekday)
    : [weekdayOf(start)]
}

function matchesDayOfMonth(recurrence: Recurrence, start: Date, date: Date) {
  const lastDay = daysInMonth(date)
  if (recurrence.byDay.length > 0) {
    const fromEnd = -Math.ceil((lastDay - date.getDate() + 1) / 7)
    return recurrence.byDay.some(
      (rule) =>
        rule.weekday === weekdayOf(date) &&
        (rule.ordinal === undefined ||
          rule.ordinal === ordinalWeekOf(date) ||
          rule.ordinal === fromEnd)
    )
  }
  const monthDays =
    recurrence.byMonthDay.length > 0 ? recurrence.byMonthDay : [start.getDate()]
  return monthDays.some(
    (day) => date.getDate() === (day > 0 ? day : lastDay + day + 1)
  )
}

function matches(recurrence: Recurrence, start: Date, date: Date) {
  const { frequency, interval } = recurrence
  const days = dayNumber(date) - dayNumber(start)
  const months =
    (date.getFullYear() - start.getFullYear()) * 12 +
    date.getMonth() -
    start.getMonth()

  switch (frequency) {
    case "DAILY":
      return days % interval === 0
    case "WEEKLY": {
      const weeks = Math.floor((days + ((start.getDay() + 6) % 7)) / 7)
      return (
        weeks % interval === 0 &&
        weekdaysOf(recurrence, start).includes(weekdayOf(date))
      )
    }
    case "MONTHLY":
      return (
        months % interval === 0 && matchesDayOfMonth(recurrence, start, date)
      )
    case "YEARLY":
      return (
        months % (12 * interval) === 0 && date.getDate() === start.getDate()
      )
  }
}

export function occurrences(
  recurrence: Recurrence,
  start: Date,
  limit: number
) {
  const found: Date[] = []
  const total = Math.min(limit, recurrence.count ?? Infinity)
  const date = new Date(start)
  for (let day = 0; day < SEARCH_LIMIT_DAYS && found.length < total; day++) {
    if (recurrence.until && date > recurrence.until) break
    if (matches(recurrence, start, date)) found.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return found
}

function joinWords(words: string[]) {
  if (words.length < 2) return words.join("")
  return `${words.slice(0, -1).join(", ")} and ${words.at(-1)}`
}

function ordinalWord(ordinal: number) {
  return ORDINALS[ordinal] ?? String(ordinal)
}

export function describeDays(recurrence: Recurrence, start: Date) {
  switch (recurrence.frequency) {
    case "WEEKLY": {
      const weekdays = weekdaysOf(recurrence, start)
      return `on ${joinWords(
        WEEKDAYS.filter((weekday) => weekdays.includes(weekday)).map(
          (weekday) => WEEKDAY_NAMES[weekday]
        )
      )}`
    }
    case "MONTHLY":
      if (recurrence.byDay.length > 0) {
        return `on ${joinWords(
          recurrence.byDay.map((rule) =>
            rule.ordinal === undefined
              ? `every ${WEEKDAY_NAMES[rule.weekday]}`
              : `the ${ordinalWord(rule.ordinal)} ${WEEKDAY_NAMES[rule.weekday]}`
          )
        )}`
      }
      return `on ${joinWords(
        (recurrence.byMonthDay.length > 0
          ? recurrence.byMonthDay
          : [start.getDate()]
        ).map((day) => (day > 0 ? `day ${day}` : `the ${ordinalWord(day)} day`))
      )}`
    case "YEARLY":
      return `on ${start.toLocaleDateString("en-US", { month: "long", day: "numeric" })}`
    default:
      return ""
  }
}

export function describeRecurrence(recurrence: Recurrence, start: Date) {
  const { frequency, interval, byDay, count, until } = recurrence
  const isWorkweek =
    frequency === "WEEKLY" &&
    interval === 1 &&
    byDay.length === 5 &&
    WEEKDAYS.slice(0, 5).every((weekday) =>
      byDay.some((rule) => rule.weekday === weekday)
    )
  const base = isWorkweek
    ? "Every weekday"
    : interval === 1
      ? ADVERBS[frequency]
      : `Every ${interval} ${UNITS[frequency]}s`
  const days = isWorkweek ? "" : describeDays(recurrence, start)
  const end = count
    ? count === 1
      ? ", once"
      : `, ${count} times`
    : until
      ? ` until ${SUMMARY_DATE.format(until)}`
      : ""
  return `${[base, days].filter(Boolean).join(" ")}${end}`
}
