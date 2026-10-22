"use client"

import { CheckIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/registry/default/lib/utils"
import { DEMO_SPRING } from "@/components/landing/live/demo-spring"
import { useDemoFrame } from "@/components/landing/use-demo-frame"

const STEPS = ["Source", "Configure", "Review", "Deploy"]

export function LiveStepper() {
  const activeStepIndex = useDemoFrame({
    frameMs: 1300,
    frameCount: STEPS.length + 1,
    reducedMotionFrame: 1,
  })

  return (
    <div className="@container w-full">
      <ol className="flex w-full items-center gap-2 text-xs">
        {STEPS.map((step, index) => {
          const isComplete = index < activeStepIndex
          const isActive = index === activeStepIndex

          return (
            <li
              key={step}
              className="flex flex-1 items-center gap-2 last:flex-none"
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] text-muted-foreground transition-[color,background-color,border-color,box-shadow] duration-500",
                  isComplete &&
                    "border-primary bg-primary text-primary-foreground",
                  isActive &&
                    "border-foreground text-foreground ring-4 ring-foreground/10"
                )}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isComplete ? "done" : "index"}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.15 }}
                  >
                    {isComplete ? <CheckIcon className="size-3" /> : index + 1}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span
                className={cn(
                  "font-medium text-muted-foreground transition-colors duration-500",
                  (isComplete || isActive) && "text-foreground",
                  !isActive && "hidden @sm:inline"
                )}
              >
                {step}
              </span>
              {index < STEPS.length - 1 && (
                <span className="relative h-px min-w-4 flex-1 overflow-hidden bg-border">
                  <motion.span
                    className="absolute inset-0 origin-left bg-primary"
                    initial={false}
                    animate={{ scaleX: isComplete ? 1 : 0 }}
                    transition={{ ...DEMO_SPRING, visualDuration: 0.6 }}
                  />
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
