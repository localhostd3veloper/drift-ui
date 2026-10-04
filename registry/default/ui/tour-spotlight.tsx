"use client"

import * as React from "react"
import { Portal } from "radix-ui"

const SPOTLIGHT_PADDING_PX = 6

function findTourTarget(name: string) {
  return document.querySelector<HTMLElement>(
    `[data-tour-target="${CSS.escape(name)}"]`
  )
}

function useScrollTargetIntoView(target: string | null) {
  React.useEffect(() => {
    if (!target) return
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    findTourTarget(target)?.scrollIntoView({
      block: "center",
      behavior: prefersReducedMotion ? "auto" : "smooth",
    })
  }, [target])
}

function useFollowTarget(
  target: string,
  spotlightRef: React.RefObject<HTMLDivElement | null>
) {
  React.useEffect(() => {
    let frameId = 0
    function follow() {
      const element = findTourTarget(target)
      const spotlight = spotlightRef.current
      if (element && spotlight) {
        const rect = element.getBoundingClientRect()
        spotlight.style.top = `${rect.top - SPOTLIGHT_PADDING_PX}px`
        spotlight.style.left = `${rect.left - SPOTLIGHT_PADDING_PX}px`
        spotlight.style.width = `${rect.width + SPOTLIGHT_PADDING_PX * 2}px`
        spotlight.style.height = `${rect.height + SPOTLIGHT_PADDING_PX * 2}px`
        spotlight.style.opacity = "1"
      }
      frameId = requestAnimationFrame(follow)
    }
    follow()
    return () => cancelAnimationFrame(frameId)
  }, [target, spotlightRef])
}

function TourSpotlight({ target }: { target: string }) {
  const spotlightRef = React.useRef<HTMLDivElement>(null)
  useFollowTarget(target, spotlightRef)

  return (
    <Portal.Root>
      <div
        aria-hidden
        data-slot="tour-overlay"
        className="fixed inset-0 z-50"
      />
      <div
        ref={spotlightRef}
        aria-hidden
        data-slot="tour-spotlight"
        className="pointer-events-none fixed z-50 rounded-lg opacity-0 shadow-[0_0_0_9999px_rgb(0_0_0/0.55)] ring-2 ring-ring transition-opacity duration-200"
      />
    </Portal.Root>
  )
}

export { TourSpotlight, findTourTarget, useScrollTargetIntoView }
