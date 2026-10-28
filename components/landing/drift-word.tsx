"use client"

import { motion } from "motion/react"

export function DriftWord({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      drag
      dragSnapToOrigin
      dragElastic={0.4}
      initial={{ opacity: 0, y: "-0.5em", x: "0.3em", rotate: 28 }}
      animate={{ opacity: 1, y: 0, x: 0, rotate: 7 }}
      whileHover={{ rotate: 3 }}
      whileDrag={{ scale: 1.06, rotate: -4 }}
      transition={{ type: "spring", bounce: 0.4, visualDuration: 0.8 }}
      className="inline-block cursor-grab touch-none rounded-[0.16em] bg-brand-solid px-[0.12em] pb-[0.06em] text-brand-solid-foreground shadow-[0_0.2em_0.5em_-0.2em] shadow-brand-solid/60 select-none active:cursor-grabbing"
    >
      {children}
    </motion.span>
  )
}
