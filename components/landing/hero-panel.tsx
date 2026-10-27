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
import { useDemoFrame } from "@/components/landing/use-demo-frame"

const TILT_SPRING = { stiffness: 120, damping: 20, mass: 0.6 }

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
        <DeployCard scene={scene} />
      </motion.div>
    </div>
  )
}
