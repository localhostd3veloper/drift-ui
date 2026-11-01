"use client"

import { useRef, useSyncExternalStore } from "react"
import dynamic from "next/dynamic"
import { useMotionValue, useReducedMotion, useSpring } from "motion/react"

import { cn } from "@/registry/default/lib/utils"

const DESKTOP_QUERY = "(min-width: 64rem)"
const POINTER_SPRING = { stiffness: 60, damping: 18, mass: 0.8 }

const DeskCards = dynamic(
  () =>
    import("@/components/landing/drift-desk-cards").then(
      (module) => module.DeskCards
    ),
  { ssr: false }
)

function subscribeToDesktop(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

function useIsDesktop() {
  return useSyncExternalStore(
    subscribeToDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false
  )
}

export function DriftStage({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const isDesktop = useIsDesktop()
  const prefersReducedMotion = useReducedMotion()
  const rawPointerX = useMotionValue(0)
  const rawPointerY = useMotionValue(0)
  const pointerX = useSpring(rawPointerX, POINTER_SPRING)
  const pointerY = useSpring(rawPointerY, POINTER_SPRING)

  function trackPointer(event: React.PointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion || event.pointerType !== "mouse") return
    const bounds = event.currentTarget.getBoundingClientRect()
    rawPointerX.set((event.clientX - bounds.left) / bounds.width - 0.5)
    rawPointerY.set((event.clientY - bounds.top) / bounds.height - 0.5)
  }

  function resetPointer() {
    rawPointerX.set(0)
    rawPointerY.set(0)
  }

  return (
    <div
      ref={stageRef}
      onPointerMove={trackPointer}
      onPointerLeave={resetPointer}
      className={cn("relative", className)}
    >
      {children}
      {isDesktop && (
        <DeskCards
          pointerX={pointerX}
          pointerY={pointerY}
          constraints={stageRef}
        />
      )}
    </div>
  )
}
