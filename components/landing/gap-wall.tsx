"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useSpring } from "motion/react"

import { cn } from "@/registry/default/lib/utils"
import {
  LiveDemoBody,
  type LiveDemoKind,
} from "@/components/landing/live/live-demo"
import {
  WorkflowDemo,
  type WorkflowDemoKind,
} from "@/components/landing/more/workflow-demo"

export type WallItem = { name: string; slug?: string }

const LIVE_KINDS: Record<string, LiveDemoKind> = {
  "tags-input": "tags",
  "tree-view": "tree",
  stepper: "stepper",
  "number-input": "number",
  "file-dropzone": "dropzone",
  timeline: "timeline",
  "password-input": "password",
  "date-time-range": "date-range",
}

const WORKFLOW_KINDS: Record<string, WorkflowDemoKind> = {
  "filter-builder": "filter",
  "shortcut-recorder": "shortcut",
  "bulk-action-bar": "bulk",
  "color-picker": "color",
  "mention-textarea": "mention",
  "time-field": "time",
  "inline-edit": "inline-edit",
  tour: "tour",
}

const PREVIEW_WIDTH = 352
const CURSOR_GAP = 28
const HIDE_DELAY_MS = 140
const FOLLOW_SPRING = { stiffness: 420, damping: 36, mass: 0.6 }
const MotionLink = motion.create(Link)

function PreviewBody({ slug }: { slug: string }) {
  const liveKind = LIVE_KINDS[slug]
  if (liveKind) return <LiveDemoBody kind={liveKind} />
  const workflowKind = WORKFLOW_KINDS[slug]
  return workflowKind ? <WorkflowDemo kind={workflowKind} /> : null
}

export function GapWall({ items }: { items: WallItem[] }) {
  const wallRef = useRef<HTMLDivElement>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [activeSlug, setActiveSlug] = useState<string>()
  const x = useSpring(0, FOLLOW_SPRING)
  const y = useSpring(0, FOLLOW_SPRING)

  function placePreview(clientX: number, clientY: number, jump: boolean) {
    const wall = wallRef.current
    if (!wall) return
    const bounds = wall.getBoundingClientRect()
    const pointerX = clientX - bounds.left
    const fitsRight = pointerX + CURSOR_GAP + PREVIEW_WIDTH <= bounds.width
    const nextX = fitsRight
      ? pointerX + CURSOR_GAP
      : pointerX - CURSOR_GAP - PREVIEW_WIDTH
    const nextY = clientY - bounds.top + CURSOR_GAP
    if (jump) {
      x.jump(nextX)
      y.jump(nextY)
    } else {
      x.set(nextX)
      y.set(nextY)
    }
  }

  function show(slug: string, clientX: number, clientY: number) {
    clearTimeout(hideTimerRef.current)
    placePreview(clientX, clientY, !activeSlug)
    setActiveSlug(slug)
  }

  function scheduleHide() {
    clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(
      () => setActiveSlug(undefined),
      HIDE_DELAY_MS
    )
  }

  return (
    <div
      ref={wallRef}
      onPointerMove={(event) =>
        activeSlug &&
        event.pointerType === "mouse" &&
        placePreview(event.clientX, event.clientY, false)
      }
      className="relative mt-16 md:mt-24"
    >
      <ul
        aria-label="shadcn/ui components, with drift-ui additions linked"
        className="flex flex-wrap gap-x-[0.38em] gap-y-[0.22em] font-display text-[clamp(1.35rem,2.6vw,2.4rem)] leading-[1.2] font-medium tracking-[-0.03em]"
      >
        {items.map(({ name, slug }) => (
          <li
            key={name}
            className={cn(
              "transition-[color,opacity] duration-300",
              !slug &&
                (activeSlug ? "text-foreground/10" : "text-foreground/20"),
              slug && activeSlug && activeSlug !== slug && "opacity-35"
            )}
          >
            {slug ? (
              <span className="relative inline-block">
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-[0.2em] border-2 border-dashed border-foreground/25"
                />
                <MotionLink
                  href={`/components/${slug}`}
                  onPointerEnter={(event) =>
                    event.pointerType === "mouse" &&
                    show(slug, event.clientX, event.clientY)
                  }
                  onPointerLeave={scheduleHide}
                  onFocus={(event) => {
                    const bounds = event.currentTarget.getBoundingClientRect()
                    show(slug, bounds.left - CURSOR_GAP, bounds.bottom)
                  }}
                  onBlur={scheduleHide}
                  initial={{ opacity: 0, x: "0.5em", y: "-0.45em", rotate: 14 }}
                  whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                  whileHover={{ rotate: -3, y: "-0.06em" }}
                  viewport={{
                    once: true,
                    amount: 0.6,
                    margin: "0px 0px -15% 0px",
                  }}
                  transition={{
                    type: "spring",
                    bounce: 0.35,
                    visualDuration: 0.7,
                  }}
                  className="relative inline-block rounded-[0.2em] bg-brand-solid px-[0.22em] pb-[0.05em] text-brand-solid-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-brand-solid/40"
                >
                  {name}
                </MotionLink>
              </span>
            ) : (
              name
            )}
          </li>
        ))}
      </ul>
      <motion.div
        aria-hidden
        inert
        style={{ x, y, width: PREVIEW_WIDTH }}
        className="pointer-events-none absolute top-0 left-0 z-10 hidden md:block"
      >
        <AnimatePresence>
          {activeSlug && (
            <motion.div
              data-theme-scope
              initial={{ opacity: 0, scale: 0.92, rotate: 3 }}
              animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", bounce: 0.25, visualDuration: 0.3 }}
              className="origin-top-left overflow-hidden rounded-xl border bg-card text-card-foreground shadow-[0_32px_64px_-24px] shadow-black/30 dark:shadow-black/80"
            >
              <div className="flex h-8 items-center border-b bg-muted/50 px-3 font-mono text-[11px] text-muted-foreground">
                {activeSlug}
              </div>
              <div key={activeSlug} className="p-4">
                <PreviewBody slug={activeSlug} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
