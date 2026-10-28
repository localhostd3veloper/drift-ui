"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"
import { motion } from "motion/react"
import { Tabs } from "radix-ui"

import { CopyCommand } from "@/components/landing/copy-command"
import {
  LiveDemo,
  type LiveDemoKind,
} from "@/components/landing/live/live-demo"

export type IndexEntry = {
  name: string
  slug: string
  kind: LiveDemoKind
  description: string
}

export function ComponentIndexTabs({ entries }: { entries: IndexEntry[] }) {
  const [active, setActive] = useState(entries[0].slug)

  return (
    <Tabs.Root
      value={active}
      onValueChange={setActive}
      orientation="vertical"
      className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14"
    >
      <Tabs.List
        aria-label="Components"
        className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {entries.map((entry) => (
          <Tabs.Trigger
            key={entry.slug}
            value={entry.slug}
            onPointerEnter={(event) =>
              event.pointerType === "mouse" && setActive(entry.slug)
            }
            className="group relative flex shrink-0 snap-start items-center rounded-full border px-4 py-2 text-left text-sm font-medium text-muted-foreground transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=active]:border-foreground/30 data-[state=active]:text-foreground lg:rounded-md lg:border-0 lg:py-1.5 lg:pr-0 lg:pl-10 lg:font-display lg:text-[clamp(2rem,3.3vw,3.1rem)] lg:leading-[1.05] lg:font-semibold lg:tracking-[-0.035em] lg:text-foreground/20 lg:hover:text-foreground/50 lg:data-[state=active]:text-foreground"
          >
            {active === entry.slug && (
              <motion.span
                layoutId="index-marker"
                aria-hidden
                transition={{
                  type: "spring",
                  bounce: 0.3,
                  visualDuration: 0.4,
                }}
                className="absolute top-1/2 left-1 hidden size-5 -translate-y-1/2 rotate-10 rounded-[5px] bg-brand-solid lg:block"
              />
            )}
            {entry.name}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {entries.map((entry) => (
        <Tabs.Content
          key={entry.slug}
          value={entry.slug}
          className="flex min-h-[30rem] flex-col overflow-hidden rounded-3xl border outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 lg:sticky lg:top-24 lg:min-h-[36rem] lg:self-start"
        >
          <div
            data-theme-scope
            className="relative flex flex-1 items-center justify-center overflow-hidden bg-muted/40 p-6 md:p-12"
          >
            <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_45%,color-mix(in_oklab,var(--brand-solid)_14%,transparent),transparent)]" />
            <motion.div
              initial={{ opacity: 0, y: 20, rotate: 2, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
              transition={{ type: "spring", bounce: 0.2, visualDuration: 0.5 }}
              className="relative w-full max-w-md"
            >
              <LiveDemo kind={entry.kind} />
            </motion.div>
          </div>
          <div className="flex flex-col gap-4 border-t bg-background p-5 md:p-6">
            <p className="max-w-[52ch] text-base leading-relaxed text-muted-foreground">
              {entry.description}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CopyCommand command={`npx shadcn add @drift-ui/${entry.slug}`} />
              <Link
                href={`/components/${entry.slug}`}
                className="group/link flex items-center gap-1 text-sm font-medium transition-colors hover:text-brand"
              >
                Docs
                <ArrowUpRightIcon className="size-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}
