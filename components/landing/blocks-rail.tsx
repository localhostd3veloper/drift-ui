"use client"

import { useRef } from "react"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { useReducedMotion } from "motion/react"

import { Button } from "@/registry/default/ui/button"

export function BlocksRail({ children }: { children: React.ReactNode }) {
  const railRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  function scrollRail(direction: 1 | -1) {
    const rail = railRef.current
    if (!rail) return
    const card = rail.firstElementChild
    const step = card
      ? card.getBoundingClientRect().width + 16
      : rail.clientWidth
    rail.scrollBy({
      left: direction * step,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="icon"
          aria-label="Previous block"
          onClick={() => scrollRail(-1)}
          className="active:scale-[0.96]"
        >
          <ArrowLeftIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Next block"
          onClick={() => scrollRail(1)}
          className="active:scale-[0.96]"
        >
          <ArrowRightIcon />
        </Button>
      </div>
      <div
        ref={railRef}
        className="relative -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 md:-mx-10 md:scroll-px-10 md:px-10"
      >
        {children}
      </div>
    </div>
  )
}
