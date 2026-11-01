"use client"

import { LazyMotion, MotionConfig } from "motion/react"

function loadFeatures() {
  return import("@/lib/motion-features").then((module) => module.domMax)
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
