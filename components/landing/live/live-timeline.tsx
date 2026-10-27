"use client"

import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/registry/default/lib/utils"
import { DEMO_SPRING } from "@/components/landing/live/demo-spring"
import { useDemoFrame } from "@/components/landing/use-demo-frame"

const EVENT_POOL = [
  { title: "Preview build passed", actor: "CI" },
  { title: "Review approved", actor: "Tomasz Wierzba" },
  { title: "Deployed to production", actor: "Noor Haddad" },
  { title: "Alert resolved", actor: "Ilse Marchetti" },
  { title: "Feature flag enabled", actor: "Kofi Mensah" },
  { title: "Rollback window closed", actor: "Scheduler" },
]
const VISIBLE_EVENTS = 3
const FIRST_EVENT_MINUTES = 13 * 60 + 41
const MINUTES_BETWEEN_EVENTS = 7

function formatClock(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60) % 24
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
}

export function LiveTimeline({
  frame: frameOverride,
}: { frame?: number } = {}) {
  const clockFrame = useDemoFrame({
    frameMs: 2000,
    frameCount: EVENT_POOL.length,
    reducedMotionFrame: 2,
  })
  const frame = frameOverride ?? clockFrame
  const events = Array.from({ length: VISIBLE_EVENTS }, (_, offset) => {
    const sequence = frame + VISIBLE_EVENTS - 1 - offset
    return {
      ...EVENT_POOL[sequence % EVENT_POOL.length],
      sequence,
      time: formatClock(
        FIRST_EVENT_MINUTES + sequence * MINUTES_BETWEEN_EVENTS
      ),
    }
  })

  return (
    <ol className="relative flex w-full flex-col">
      <AnimatePresence mode="popLayout" initial={false}>
        {events.map((event, index) => (
          <motion.li
            key={event.sequence}
            layout
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={DEMO_SPRING}
            className="relative flex gap-3 pb-4 last:pb-0"
          >
            {index < VISIBLE_EVENTS - 1 && (
              <span className="absolute top-3 left-[3.5px] h-full w-px bg-border" />
            )}
            <span className="relative mt-1.5 flex size-2 shrink-0">
              {index === 0 && (
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60 motion-reduce:animate-none" />
              )}
              <span
                className={cn(
                  "relative size-2 rounded-full bg-muted-foreground transition-colors duration-500",
                  index === 0 && "bg-emerald-400"
                )}
              />
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium">{event.title}</span>
              <span className="text-[11px] text-muted-foreground">
                {event.actor}, {event.time}
              </span>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </ol>
  )
}
