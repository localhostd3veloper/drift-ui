"use client"

import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/registry/default/lib/utils"
import { DEMO_SPRING } from "@/components/landing/live/demo-spring"
import { useDemoFrame } from "@/components/landing/use-demo-frame"

const DAYS = [
  { weekday: "Mon", date: 9 },
  { weekday: "Tue", date: 10 },
  { weekday: "Wed", date: 11 },
  { weekday: "Thu", date: 12 },
  { weekday: "Fri", date: 13 },
  { weekday: "Sat", date: 14 },
  { weekday: "Sun", date: 15 },
]

const SCRIPT: {
  startIndex: number
  endIndex: number
  times?: [string, string]
}[] = [
  { startIndex: -1, endIndex: -1 },
  { startIndex: 1, endIndex: 1 },
  { startIndex: 1, endIndex: 2 },
  { startIndex: 1, endIndex: 3 },
  { startIndex: 1, endIndex: 4 },
  { startIndex: 1, endIndex: 4, times: ["Tue 09:00", "Fri 17:00"] },
  { startIndex: 1, endIndex: 4, times: ["Tue 09:30", "Fri 17:45"] },
  { startIndex: 1, endIndex: 4, times: ["Tue 09:30", "Fri 17:45"] },
  { startIndex: 1, endIndex: 4, times: ["Tue 09:30", "Fri 17:45"] },
]

function TimeChip({ value }: { value: string }) {
  return (
    <span className="relative flex h-7 w-[5.5rem] items-center justify-center overflow-hidden rounded-md border">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={DEMO_SPRING}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export function LiveDateRange() {
  const frame = useDemoFrame({
    frameMs: 600,
    frameCount: SCRIPT.length,
    reducedMotionFrame: 6,
  })
  const { startIndex, endIndex, times } = SCRIPT[frame]
  const hasRange = startIndex >= 0

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="relative grid grid-cols-7 text-center">
        {DAYS.map((day) => (
          <span
            key={day.date}
            className="pb-1 text-[10px] text-muted-foreground uppercase"
          >
            {day.weekday}
          </span>
        ))}
        {hasRange && (
          <motion.span
            layout
            transition={DEMO_SPRING}
            style={{
              gridColumn: `${startIndex + 1} / ${endIndex + 2}`,
              gridRow: 2,
            }}
            className="h-8 rounded-md bg-accent ring-1 ring-ring/30"
          />
        )}
        {DAYS.map((day, index) => (
          <span
            key={day.date}
            style={{ gridColumn: index + 1, gridRow: 2 }}
            className={cn(
              "relative flex h-8 items-center justify-center text-xs tabular-nums transition-colors duration-300",
              (index === startIndex || index === endIndex) &&
                "font-semibold text-foreground"
            )}
          >
            {day.date}
          </span>
        ))}
      </div>
      <div className="flex h-7 items-center gap-2 font-mono text-xs">
        <AnimatePresence>
          {times && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={DEMO_SPRING}
              className="flex items-center gap-2"
            >
              <TimeChip value={times[0]} />
              <span className="text-muted-foreground">to</span>
              <TimeChip value={times[1]} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
