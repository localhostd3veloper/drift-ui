"use client"

import { useRef } from "react"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"

import { Button } from "@/registry/default/ui/button"
import { CopyCommand } from "@/components/landing/copy-command"
import { SlotPattern } from "@/components/landing/slot-pattern"

const SETTLE_SPRING = { stiffness: 140, damping: 22, mass: 0.6 }

function AssemblingMark({ progress }: { progress: MotionValue<number> }) {
  const x = useTransform(progress, [0, 1], [7, 0])
  const y = useTransform(progress, [0, 1], [-7, 0])
  const rotate = useTransform(progress, [0, 1], [10, 0])

  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden
      className="w-full max-w-[22rem] overflow-visible"
    >
      <g fill="currentColor" fillOpacity="0.3">
        <rect x="3" y="10" width="12" height="12" rx="3" />
        <rect x="3" y="25" width="12" height="12" rx="3" />
        <rect x="18" y="25" width="12" height="12" rx="3" />
      </g>
      <rect
        x="18.4"
        y="10.4"
        width="11.2"
        height="11.2"
        rx="2.6"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="0.5"
        strokeDasharray="1.2 1.2"
      />
      <motion.rect
        x="18"
        y="10"
        width="12"
        height="12"
        rx="3"
        fill="currentColor"
        style={{
          x,
          y,
          rotate,
          transformBox: "fill-box",
          transformOrigin: "center",
        }}
      />
    </svg>
  )
}

export function ClosingCta() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  })
  const progress = useSpring(scrollYProgress, SETTLE_SPRING)
  const settled = useSpring(1)

  return (
    <section ref={sectionRef} className="px-2 pb-2 md:px-4 md:pb-4">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-brand-solid text-brand-solid-foreground [--border:oklch(1_0_0/0.3)] [--card:oklch(1_0_0/0.1)] [--foreground:oklch(0.985_0_0)] [--muted-foreground:oklch(0.985_0_0/0.75)] [--primary-foreground:var(--brand-solid)] [--primary:oklch(0.985_0_0)] [--ring:oklch(1_0_0/0.6)]">
        <SlotPattern className="absolute inset-0 -z-10 size-full [mask-image:radial-gradient(ellipse_60%_80%_at_80%_50%,black,transparent)] text-white/[0.06]" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:px-10 md:py-28 lg:grid-cols-12 lg:py-32">
          <div className="flex reveal flex-col gap-10 lg:col-span-8">
            <h2 className="font-display text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.9] font-semibold tracking-[-0.045em]">
              Fill the gaps.
              <span className="block opacity-55">Keep your system.</span>
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button
                asChild
                size="lg"
                className="h-11 px-5 active:scale-[0.98]"
              >
                <Link href="/components">
                  Browse components <ArrowRightIcon />
                </Link>
              </Button>
              <CopyCommand
                command="npx shadcn add @drift-ui/stepper"
                className="min-h-11"
              />
            </div>
          </div>
          <div className="flex justify-center lg:col-span-4 lg:justify-end">
            <AssemblingMark
              progress={prefersReducedMotion ? settled : progress}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
