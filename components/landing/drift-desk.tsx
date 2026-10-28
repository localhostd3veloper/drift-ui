"use client"

import { useRef, useState } from "react"
import { GripHorizontalIcon } from "lucide-react"
import {
  motion,
  useDragControls,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"

import { cn } from "@/registry/default/lib/utils"
import { Label } from "@/registry/default/ui/label"
import { NumberInput } from "@/registry/default/ui/number-input"
import {
  PasswordInput,
  PasswordStrength,
} from "@/registry/default/ui/password-input"
import { ShortcutRecorder } from "@/registry/default/ui/shortcut-recorder"
import { TagsInput } from "@/registry/default/ui/tags-input"
import { TimeField } from "@/registry/default/ui/time-field"
import { StepperSpecimen } from "@/components/landing/specimens/stepper-specimen"

type Side = "left" | "right"

type DeskCard = {
  slug: string
  side: Side
  inset: string
  top: string
  rotate: number
  depth: number
  floatSeconds: number
  className: string
  Body: () => React.ReactNode
}

const PARALLAX_PX = 36
const ENTRY_OFFSET_PX = 120
const POINTER_SPRING = { stiffness: 60, damping: 18, mass: 0.8 }

function TagsBody() {
  return (
    <div className="grid gap-2">
      <Label htmlFor="desk-tags">Environments</Label>
      <TagsInput
        id="desk-tags"
        defaultValue={["eu-west-1", "canary"]}
        placeholder="Add region"
      />
    </div>
  )
}

function NumberBody() {
  return (
    <div className="grid gap-2">
      <Label htmlFor="desk-replicas">Replicas</Label>
      <NumberInput id="desk-replicas" defaultValue={3} min={1} max={12} />
    </div>
  )
}

function StepperBody() {
  return <StepperSpecimen />
}

function ShortcutBody() {
  return (
    <div className="grid gap-2">
      <span className="text-sm font-medium">Command menu</span>
      <ShortcutRecorder
        aria-label="Command menu shortcut"
        defaultValue="Mod+K"
        className="w-full"
      />
    </div>
  )
}

function PasswordBody() {
  const [password, setPassword] = useState("copper-lantern")

  return (
    <div className="grid gap-2">
      <Label htmlFor="desk-password">New password</Label>
      <PasswordInput
        id="desk-password"
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <PasswordStrength value={password} />
    </div>
  )
}

function TimeBody() {
  return (
    <div className="grid gap-2">
      <span className="text-sm font-medium">Quiet hours</span>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <TimeField aria-label="From" defaultValue="22:00" hourCycle={24} />
        to
        <TimeField aria-label="Until" defaultValue="07:30" hourCycle={24} />
      </div>
    </div>
  )
}

const CARDS: DeskCard[] = [
  {
    slug: "tags-input",
    side: "left",
    inset: "3%",
    top: "7%",
    rotate: -6,
    depth: 1,
    floatSeconds: 9,
    className: "w-[19rem]",
    Body: TagsBody,
  },
  {
    slug: "number-input",
    side: "right",
    inset: "7%",
    top: "6%",
    rotate: 6,
    depth: 0.6,
    floatSeconds: 11,
    className: "w-[13rem]",
    Body: NumberBody,
  },
  {
    slug: "stepper",
    side: "left",
    inset: "1%",
    top: "40%",
    rotate: 4,
    depth: 0.7,
    floatSeconds: 10,
    className: "w-[22rem] -translate-x-12 translate-y-28 xl:translate-0",
    Body: StepperBody,
  },
  {
    slug: "shortcut-recorder",
    side: "right",
    inset: "-1%",
    top: "35%",
    rotate: -5,
    depth: 1,
    floatSeconds: 12,
    className: "w-[15rem] translate-y-24 xl:translate-0",
    Body: ShortcutBody,
  },
  {
    slug: "password-input",
    side: "left",
    inset: "7%",
    top: "68%",
    rotate: -3,
    depth: 0.85,
    floatSeconds: 8,
    className: "hidden w-[16rem] xl:block",
    Body: PasswordBody,
  },
  {
    slug: "time-field",
    side: "right",
    inset: "6%",
    top: "67%",
    rotate: 3,
    depth: 0.75,
    floatSeconds: 13,
    className: "hidden w-[17rem] xl:block",
    Body: TimeBody,
  },
]

function DeskCardFrame({
  card,
  index,
  zIndex,
  pointerX,
  pointerY,
  constraints,
  onRaise,
}: {
  card: DeskCard
  index: number
  zIndex: number
  pointerX: MotionValue<number>
  pointerY: MotionValue<number>
  constraints: React.RefObject<HTMLDivElement | null>
  onRaise: () => void
}) {
  const dragControls = useDragControls()
  const parallaxX = useTransform(pointerX, (x) => x * -PARALLAX_PX * card.depth)
  const parallaxY = useTransform(pointerY, (y) => y * -PARALLAX_PX * card.depth)
  const { Body } = card

  function startDrag(event: React.PointerEvent) {
    if (event.pointerType === "touch") return
    dragControls.start(event)
  }

  return (
    <div
      style={
        {
          [`--card-${card.side}`]: card.inset,
          "--card-top": card.top,
          "--float-duration": `${card.floatSeconds}s`,
          zIndex,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-auto absolute top-(--card-top) right-(--card-right) left-(--card-left) scale-[0.82] xl:scale-100",
        card.side === "left" ? "origin-left" : "origin-right",
        "active:[animation-play-state:paused] motion-safe:animate-float",
        card.className
      )}
      onPointerDownCapture={onRaise}
    >
      <motion.div style={{ x: parallaxX, y: parallaxY }}>
        <motion.div
          data-theme-scope
          drag
          dragControls={dragControls}
          dragListener={false}
          dragConstraints={constraints}
          dragElastic={0.15}
          dragTransition={{ power: 0.25, timeConstant: 260 }}
          initial={{
            opacity: 0,
            x: card.side === "left" ? -ENTRY_OFFSET_PX : ENTRY_OFFSET_PX,
            rotate: card.rotate * 3,
          }}
          animate={{ opacity: 1, x: 0, rotate: card.rotate }}
          whileDrag={{ scale: 1.03 }}
          transition={{
            type: "spring",
            bounce: 0.2,
            visualDuration: 1,
            delay: 0.3 + index * 0.08,
          }}
          className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-[0_28px_56px_-28px] shadow-black/25 dark:shadow-black/80"
        >
          <div
            onPointerDown={startDrag}
            className="flex h-8 cursor-grab touch-none items-center justify-between border-b bg-muted/50 px-3 font-mono text-[11px] text-muted-foreground select-none active:cursor-grabbing"
          >
            <span>{card.slug}</span>
            <GripHorizontalIcon aria-hidden className="size-3.5" />
          </div>
          <div className="p-4">
            <Body />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export function DriftStage({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [stack, setStack] = useState(() => CARDS.map((card) => card.slug))
  const rawPointerX = useMotionValue(0)
  const rawPointerY = useMotionValue(0)
  const pointerX = useSpring(rawPointerX, POINTER_SPRING)
  const pointerY = useSpring(rawPointerY, POINTER_SPRING)

  function trackPointer(event: React.PointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion || event.pointerType !== "mouse") return
    const bounds = event.currentTarget.getBoundingClientRect()
    rawPointerX.set((event.clientX - bounds.left) / bounds.width - 0.5)
    rawPointerY.set((event.clientY - bounds.top) / bounds.height - 0.5)
  }

  function resetPointer() {
    rawPointerX.set(0)
    rawPointerY.set(0)
  }

  function raise(slug: string) {
    setStack((current) =>
      current.at(-1) === slug
        ? current
        : [...current.filter((entry) => entry !== slug), slug]
    )
  }

  return (
    <div
      ref={stageRef}
      onPointerMove={trackPointer}
      onPointerLeave={resetPointer}
      className={cn("relative", className)}
    >
      {children}
      <div
        role="group"
        aria-label="Live drift-ui components"
        className="pointer-events-none absolute inset-0 z-20 hidden lg:block"
      >
        {CARDS.map((card, index) => (
          <DeskCardFrame
            key={card.slug}
            card={card}
            index={index}
            zIndex={stack.indexOf(card.slug) + 1}
            pointerX={pointerX}
            pointerY={pointerY}
            constraints={stageRef}
            onRaise={() => raise(card.slug)}
          />
        ))}
      </div>
    </div>
  )
}
