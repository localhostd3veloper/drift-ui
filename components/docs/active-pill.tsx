"use client"

import { motion } from "motion/react"

import { cn } from "@/registry/default/lib/utils"

export function ActivePill({
  layoutId,
  className,
}: {
  layoutId: string
  className?: string
}) {
  return (
    <motion.span
      aria-hidden
      layoutId={layoutId}
      transition={{ type: "spring", stiffness: 480, damping: 38 }}
      className={cn("absolute inset-0 -z-10 rounded-md bg-muted", className)}
    />
  )
}
