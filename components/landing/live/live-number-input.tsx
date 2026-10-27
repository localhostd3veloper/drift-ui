"use client"

import { MinusIcon, PlusIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/registry/default/lib/utils"
import { Label } from "@/registry/default/ui/label"
import { DEMO_SPRING } from "@/components/landing/live/demo-spring"
import { useDemoFrame } from "@/components/landing/use-demo-frame"

const MAX_REPLICAS = 6
const MIN_REPLICAS = 1
const VALUES = [3, 4, 5, 6, 6, 6, 5, 4, 3, 2, 1, 1, 2, 3]

function StepButton({
  isPressed,
  isDisabled,
  children,
}: {
  isPressed: boolean
  isDisabled: boolean
  children: React.ReactNode
}) {
  return (
    <motion.span
      animate={{ scale: isPressed ? 0.86 : 1 }}
      transition={DEMO_SPRING}
      className={cn(
        "flex h-full w-9 items-center justify-center transition-[opacity,background-color]",
        isPressed && "bg-accent",
        isDisabled && "opacity-35"
      )}
    >
      {children}
    </motion.span>
  )
}

export function LiveNumberInput({
  frame: frameOverride,
}: { frame?: number } = {}) {
  const clockFrame = useDemoFrame({
    frameMs: 620,
    frameCount: VALUES.length,
    reducedMotionFrame: 0,
  })
  const frame = frameOverride ?? clockFrame
  const value = VALUES[frame]
  const previousValue = VALUES[(frame - 1 + VALUES.length) % VALUES.length]
  const direction = Math.sign(value - previousValue)

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Replicas</Label>
        <span className="font-mono text-[11px] whitespace-nowrap text-muted-foreground">
          min {MIN_REPLICAS}, max {MAX_REPLICAS}
        </span>
      </div>
      <div className="flex h-9 w-36 shrink-0 items-center overflow-hidden rounded-md border border-input bg-input/30">
        <StepButton
          isPressed={direction < 0}
          isDisabled={value === MIN_REPLICAS}
        >
          <MinusIcon className="size-3.5" />
        </StepButton>
        <span className="relative flex h-full flex-1 items-center justify-center overflow-hidden border-x border-input font-mono text-sm tabular-nums">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.span
              key={value}
              custom={direction}
              initial={{ y: direction * 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: direction * -14, opacity: 0 }}
              transition={DEMO_SPRING}
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </span>
        <StepButton
          isPressed={direction > 0}
          isDisabled={value === MAX_REPLICAS}
        >
          <PlusIcon className="size-3.5" />
        </StepButton>
      </div>
    </div>
  )
}
