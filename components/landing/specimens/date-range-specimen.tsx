import { cn } from "@/registry/default/lib/utils"

const DAYS = [
  { weekday: "Mon", date: 9 },
  { weekday: "Tue", date: 10 },
  { weekday: "Wed", date: 11 },
  { weekday: "Thu", date: 12 },
  { weekday: "Fri", date: 13 },
  { weekday: "Sat", date: 14 },
  { weekday: "Sun", date: 15 },
]
const RANGE_START_DATE = 11
const RANGE_END_DATE = 13

function isInRange(date: number) {
  return date >= RANGE_START_DATE && date <= RANGE_END_DATE
}

export function DateRangeSpecimen({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {DAYS.map((day) => (
          <div key={day.date} className="flex flex-col gap-1">
            <span className="text-[10px] text-muted-foreground uppercase">
              {day.weekday}
            </span>
            <span
              className={cn(
                "mx-auto flex size-8 items-center justify-center text-xs tabular-nums",
                isInRange(day.date) && "w-full bg-accent",
                day.date === RANGE_START_DATE && "rounded-l-md",
                day.date === RANGE_END_DATE && "rounded-r-md",
                (day.date === RANGE_START_DATE ||
                  day.date === RANGE_END_DATE) &&
                  "bg-primary text-primary-foreground"
              )}
            >
              {day.date}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 font-mono text-xs">
        <span className="rounded-md border px-2 py-1">Wed 09:30</span>
        <span className="text-muted-foreground">to</span>
        <span className="rounded-md border px-2 py-1">Fri 17:45</span>
      </div>
    </div>
  )
}
