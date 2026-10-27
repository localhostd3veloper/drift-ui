"use client"

import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"
import { motion } from "motion/react"
import { Tabs } from "radix-ui"

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
  return (
    <Tabs.Root
      defaultValue={entries[0].slug}
      orientation="vertical"
      className="grid gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-10"
    >
      <Tabs.List
        aria-label="Components"
        className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {entries.map((entry) => (
          <Tabs.Trigger
            key={entry.slug}
            value={entry.slug}
            className="group flex shrink-0 snap-start flex-col items-start gap-1 rounded-full border px-4 py-2 text-left text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=active]:border-foreground/30 data-[state=active]:text-foreground lg:rounded-none lg:border-0 lg:border-l-2 lg:px-5 lg:py-3.5 lg:data-[state=active]:border-brand"
          >
            <span className="text-sm font-medium lg:text-lg lg:tracking-tight">
              {entry.name}
            </span>
            <span className="hidden max-w-[38ch] text-sm leading-relaxed text-muted-foreground lg:group-data-[state=active]:block">
              {entry.description}
            </span>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {entries.map((entry) => (
        <Tabs.Content
          key={entry.slug}
          value={entry.slug}
          className="flex min-h-[26rem] flex-col overflow-hidden rounded-2xl border bg-muted/30 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 lg:min-h-[34rem]"
        >
          <div className="flex flex-1 items-center justify-center bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-[size:18px_18px] p-6 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: "spring",
                bounce: 0.15,
                visualDuration: 0.45,
              }}
              className="w-full max-w-md"
            >
              <LiveDemo kind={entry.kind} />
            </motion.div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-background/60 px-5 py-3">
            <p className="text-sm text-muted-foreground lg:hidden">
              {entry.description}
            </p>
            <code className="hidden font-mono text-xs text-muted-foreground lg:block">
              npx shadcn add @drift-ui/{entry.slug}
            </code>
            <Link
              href={`/components/${entry.slug}`}
              className="group/link flex items-center gap-1 text-sm font-medium transition-colors hover:text-brand"
            >
              Docs
              <ArrowUpRightIcon className="size-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </Link>
          </div>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}
