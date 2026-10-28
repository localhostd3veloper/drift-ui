"use client"

import { useState } from "react"
import { motion } from "motion/react"

import { cn } from "@/registry/default/lib/utils"
import { KeyboardDemo } from "@/components/landing/principles/keyboard-demo"
import { SlotDemo } from "@/components/landing/principles/slot-demo"
import { TokensDemo } from "@/components/landing/principles/tokens-demo"

const PRINCIPLES = [
  {
    title: "Reads the tokens you have",
    description:
      "Every color, radius and ring comes from the CSS variables shadcn init wrote. Retheme once, everything follows.",
    Demo: TokensDemo,
  },
  {
    title: "Radix or Base UI underneath",
    description:
      "Focus, roving tabindex and screen reader labels are handled before styling starts. Click the tree and use your arrow keys.",
    Demo: KeyboardDemo,
  },
  {
    title: "A data-slot on every part",
    description: "Target any piece from your own CSS without forking the file.",
    Demo: SlotDemo,
  },
]

export function Principles() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
      <ol className="hidden flex-col gap-10 self-start lg:sticky lg:top-32 lg:flex">
        {PRINCIPLES.map((principle, index) => (
          <li
            key={principle.title}
            className={cn(
              "flex flex-col gap-2 border-l-2 pl-6 transition-colors duration-500",
              index === activeIndex
                ? "border-brand"
                : "border-border text-muted-foreground"
            )}
          >
            <h3 className="text-2xl font-medium tracking-tight">
              {principle.title}
            </h3>
            <p
              className={cn(
                "max-w-[40ch] leading-relaxed transition-colors duration-500",
                index === activeIndex && "text-muted-foreground"
              )}
            >
              {principle.description}
            </p>
          </li>
        ))}
      </ol>
      <div className="flex min-w-0 flex-col gap-20 lg:gap-32">
        {PRINCIPLES.map(({ title, description, Demo }, index) => (
          <motion.article
            key={title}
            onViewportEnter={() => setActiveIndex(index)}
            viewport={{ amount: 0.6 }}
            className="flex min-w-0 flex-col gap-6 lg:min-h-[28rem] lg:justify-center"
          >
            <div className="flex flex-col gap-2 lg:hidden">
              <h3 className="text-2xl font-medium tracking-tight">{title}</h3>
              <p className="leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
            <Demo />
          </motion.article>
        ))}
      </div>
    </div>
  )
}
