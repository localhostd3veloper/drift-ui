"use client"

import { AnimatePresence, motion } from "motion/react"

import {
  ComponentCard,
  type CatalogCard,
} from "@/components/docs/component-card"

const CARD_SPRING = { type: "spring", stiffness: 260, damping: 30 } as const

export function CardGroup({
  id,
  label,
  description,
  cards,
}: {
  id: string
  label: string
  description: string
  cards: CatalogCard[]
}) {
  return (
    <motion.section
      layout="position"
      transition={CARD_SPRING}
      aria-labelledby={`group-${id}`}
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline gap-3">
          <h2 id={`group-${id}`} className="text-xl font-medium tracking-tight">
            {label}
          </h2>
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {cards.length}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <ul className="relative grid gap-x-5 gap-y-12 sm:grid-cols-2">
        <AnimatePresence initial={false} mode="popLayout">
          {cards.map((card) => (
            <motion.li
              key={card.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={CARD_SPRING}
            >
              <ComponentCard card={card} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </motion.section>
  )
}
