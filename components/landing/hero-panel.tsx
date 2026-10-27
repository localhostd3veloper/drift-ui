"use client"

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"

import { cn } from "@/registry/default/lib/utils"
import { DeployCard } from "@/components/landing/hero-deploy-card"
import {
  SCENE_DONE_FRAME,
  SCENE_FRAME_COUNT,
  SCENE_FRAME_MS,
  sceneAt,
} from "@/components/landing/hero-scene"
import { LiveTimeline } from "@/components/landing/live/live-timeline"
import { TreeViewSpecimen } from "@/components/landing/specimens/tree-view-specimen"
import { useDemoFrame } from "@/components/landing/use-demo-frame"

const TILT_SPRING = { stiffness: 120, damping: 20, mass: 0.6 }

function ExplorerCard({ timelineFrame }: { timelineFrame: number }) {
  return (
    <div className="flex w-60 flex-col gap-4 rounded-2xl border bg-card p-4 shadow-[0_32px_64px_-32px] shadow-black/20 dark:shadow-black/80">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">ledgerline-web</span>
        <span className="font-mono text-[11px] text-muted-foreground">
          main
        </span>
      </div>
      <TreeViewSpecimen />
      <div className="border-t pt-4">
        <p className="mb-3 text-xs font-medium text-muted-foreground">
          Activity
        </p>
        <LiveTimeline frame={timelineFrame} />
      </div>
    </div>
  )
}

export function HeroPanel({ className }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion()
  const frame = useDemoFrame({
    frameMs: SCENE_FRAME_MS,
    frameCount: SCENE_FRAME_COUNT,
    reducedMotionFrame: SCENE_DONE_FRAME,
  })
  const scene = sceneAt(frame)

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const springX = useSpring(pointerX, TILT_SPRING)
  const springY = useSpring(pointerY, TILT_SPRING)
  const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5])
  const rotateX = useTransform(springY, [-0.5, 0.5], [4, -4])
  const explorerX = useTransform(springX, [-0.5, 0.5], [18, -18])
  const explorerY = useTransform(springY, [-0.5, 0.5], [14, -14])

  function trackPointer(event: React.PointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion || event.pointerType !== "mouse") return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5)
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5)
  }

  function resetPointer() {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <div
      onPointerMove={trackPointer}
      onPointerLeave={resetPointer}
      className={cn("relative [perspective:1600px]", className)}
    >
      <motion.div
        aria-hidden
        inert
        style={{ rotateX, rotateY }}
        className="relative transform-3d"
      >
        <motion.div
          initial={{ opacity: 0, x: 48 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            type: "spring",
            bounce: 0.15,
            visualDuration: 0.8,
            delay: 0.7,
          }}
          className="absolute top-0 right-0 hidden xl:block"
        >
          <motion.div style={{ x: explorerX, y: explorerY }}>
            <ExplorerCard timelineFrame={scene.timelineFrame} />
          </motion.div>
        </motion.div>
        <div className="relative xl:mt-14 xl:mr-28">
          <DeployCard scene={scene} />
        </div>
      </motion.div>
    </div>
  )
}
