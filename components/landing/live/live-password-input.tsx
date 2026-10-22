"use client"

import { EyeIcon, EyeOffIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { DEMO_SPRING } from "@/components/landing/live/demo-spring"
import { useDemoFrame } from "@/components/landing/use-demo-frame"

const PASSWORD = "copper-lantern9"
const STRENGTH_LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"]
const STRENGTH_SEGMENTS = 4
const CHARACTERS_PER_SEGMENT = 4
const REVEAL_START = PASSWORD.length + 3
const REVEAL_END = REVEAL_START + 6
const FRAME_COUNT = REVEAL_END + 5

export function LivePasswordInput() {
  const frame = useDemoFrame({
    frameMs: 170,
    frameCount: FRAME_COUNT,
    reducedMotionFrame: PASSWORD.length,
  })
  const typedLength = Math.min(frame, PASSWORD.length)
  const isRevealed = frame >= REVEAL_START && frame < REVEAL_END
  const filledSegments = Math.min(
    STRENGTH_SEGMENTS,
    Math.floor(typedLength / CHARACTERS_PER_SEGMENT)
  )
  const strengthLabel = STRENGTH_LABELS[filledSegments]

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex h-9 items-center justify-between gap-2 rounded-md border border-input bg-input/30 px-3">
        <span className="flex min-w-0 items-center overflow-hidden font-mono text-sm">
          {PASSWORD.slice(0, typedLength)
            .split("")
            .map((character, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.12 }}
                className="inline-block w-[0.62em] text-center"
              >
                {isRevealed ? character : "•"}
              </motion.span>
            ))}
          <span className="h-4 w-px animate-pulse bg-foreground" />
        </span>
        {isRevealed ? (
          <EyeOffIcon className="size-4 shrink-0 text-foreground" />
        ) : (
          <EyeIcon className="size-4 shrink-0 text-muted-foreground" />
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="grid flex-1 grid-cols-4 gap-1">
          {Array.from({ length: STRENGTH_SEGMENTS }, (_, index) => (
            <span
              key={index}
              className="h-1 overflow-hidden rounded-full bg-muted"
            >
              <motion.span
                className="block h-full origin-left bg-foreground"
                initial={false}
                animate={{ scaleX: index < filledSegments ? 1 : 0 }}
                transition={DEMO_SPRING}
              />
            </span>
          ))}
        </div>
        <span className="relative h-4 w-16 overflow-hidden text-right text-[11px] text-muted-foreground">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={strengthLabel}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={DEMO_SPRING}
              className="absolute right-0"
            >
              {strengthLabel}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>
    </div>
  )
}
