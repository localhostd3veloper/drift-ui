"use client"

import * as m from "motion/react-m"

import { cn } from "@/registry/default/lib/utils"

export function ActivePill({
  layoutId,
  className,
}: {
  layoutId: string
  className?: string
}) {
  return (
    <m.span
      aria-hidden
      layoutId={layoutId}
      transition={{ type: "spring", stiffness: 480, damping: 38 }}
      className={cn("absolute inset-0 -z-10 rounded-md bg-muted", className)}
    />
  )
}
