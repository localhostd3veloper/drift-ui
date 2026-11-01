"use client"

import { motion } from "motion/react"
import { Tabs } from "radix-ui"

import { SectionHeading } from "@/components/landing/section-heading"
import { KeyboardDemo } from "@/components/landing/principles/keyboard-demo"
import { SlotDemo } from "@/components/landing/principles/slot-demo"
import { TokensDemo } from "@/components/landing/principles/tokens-demo"

const PRINCIPLES = [
  {
    id: "tokens",
    title: "Reads the tokens you have",
    description:
      "Every color, radius and ring comes from the CSS variables shadcn init wrote. Retheme once, everything follows.",
    Demo: TokensDemo,
  },
  {
    id: "keyboard",
    title: "Radix or Base UI underneath",
    description:
      "Focus, roving tabindex and screen reader labels are handled before styling starts. Click the tree and use your arrow keys.",
    Demo: KeyboardDemo,
  },
  {
    id: "slots",
    title: "A data-slot on every part",
    description: "Target any piece from your own CSS without forking the file.",
    Demo: SlotDemo,
  },
]

export function Principles() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 md:px-10 md:py-36">
      <SectionHeading
        title="No new design system to learn"
        lead="Each file reads like the rest of your ui folder: your variables, your primitives, your class names."
      />
      <Tabs.Root
        defaultValue={PRINCIPLES[0].id}
        className="mt-14 flex reveal flex-col md:mt-20"
      >
        <Tabs.List
          aria-label="Principles"
          className="grid border-t md:grid-cols-3"
        >
          {PRINCIPLES.map((principle) => (
            <Tabs.Trigger
              key={principle.id}
              value={principle.id}
              className="group relative -mt-px flex flex-col gap-2 border-t-2 border-transparent py-5 pr-6 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=active]:border-brand-solid md:py-7"
            >
              <span className="font-display text-xl font-semibold tracking-tight text-foreground/60 transition-colors group-hover:text-foreground/70 group-data-[state=active]:text-foreground md:text-2xl">
                {principle.title}
              </span>
              <span className="max-w-[40ch] text-sm leading-relaxed text-muted-foreground">
                {principle.description}
              </span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {PRINCIPLES.map(({ id, Demo }) => (
          <Tabs.Content
            key={id}
            value={id}
            className="mt-4 flex min-h-[32rem] items-center justify-center rounded-3xl border bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-[size:20px_20px] p-5 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 md:p-14"
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                bounce: 0.15,
                visualDuration: 0.45,
              }}
              className="w-full max-w-2xl min-w-0"
            >
              <Demo />
            </motion.div>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </section>
  )
}
