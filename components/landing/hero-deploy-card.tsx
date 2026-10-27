"use client"

import { CheckIcon, LoaderCircleIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/registry/default/lib/utils"
import { Badge } from "@/registry/default/ui/badge"
import { Button } from "@/registry/default/ui/button"
import { Label } from "@/registry/default/ui/label"
import type { SceneFocus, SceneState } from "@/components/landing/hero-scene"
import { DEMO_SPRING } from "@/components/landing/live/demo-spring"
import { LiveFileDropzone } from "@/components/landing/live/live-file-dropzone"
import { LiveNumberInput } from "@/components/landing/live/live-number-input"
import { LiveStepper } from "@/components/landing/live/live-stepper"
import { LiveTagsInput } from "@/components/landing/live/live-tags-input"
import { DateRangeSpecimen } from "@/components/landing/specimens/date-range-specimen"

function FocusField({
  label,
  isFocused,
  children,
}: {
  label?: string
  isFocused: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "-m-2 grid content-start gap-2 rounded-lg p-2 ring-1 ring-transparent transition-[background-color,box-shadow] duration-300",
        isFocused && "bg-brand/5 ring-brand/40"
      )}
    >
      {label && <Label>{label}</Label>}
      {children}
    </div>
  )
}

const STATUS_LABEL: Record<SceneState["deploy"], string> = {
  draft: "Draft",
  pressed: "Draft",
  deploying: "Deploying",
  live: "Live",
}

function StatusBadge({ deploy }: { deploy: SceneState["deploy"] }) {
  const label = STATUS_LABEL[deploy]

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={label}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={DEMO_SPRING}
      >
        <Badge variant="outline" className="gap-1.5">
          {deploy === "live" && (
            <span className="size-1.5 rounded-full bg-emerald-400" />
          )}
          {deploy === "deploying" && (
            <LoaderCircleIcon className="animate-spin" />
          )}
          {label}
        </Badge>
      </motion.span>
    </AnimatePresence>
  )
}

function DeployButton({ scene }: { scene: SceneState }) {
  const label = {
    draft: `Deploy ${scene.replicas} replicas`,
    pressed: `Deploy ${scene.replicas} replicas`,
    deploying: "Deploying",
    live: "Deployed",
  }[scene.deploy]

  return (
    <motion.div
      layout
      animate={{ scale: scene.deploy === "pressed" ? 0.95 : 1 }}
      transition={DEMO_SPRING}
      className={cn(
        "rounded-md ring-offset-2 ring-offset-card transition-shadow duration-300",
        scene.focus === "deploy" && "ring-2 ring-brand/50"
      )}
    >
      <Button className="min-w-36">
        {scene.deploy === "deploying" && (
          <LoaderCircleIcon className="animate-spin" />
        )}
        {scene.deploy === "live" && <CheckIcon />}
        {label}
      </Button>
    </motion.div>
  )
}

export function DeployCard({ scene }: { scene: SceneState }) {
  const isFocused = (focus: SceneFocus) => scene.focus === focus

  return (
    <div className="relative flex flex-col rounded-2xl border bg-card shadow-[0_40px_80px_-40px] shadow-black/25 dark:shadow-black">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 md:px-6">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">New deployment</span>
          <span className="text-xs text-muted-foreground">
            ledgerline-web, production
          </span>
        </div>
        <StatusBadge deploy={scene.deploy} />
      </div>
      <div className="border-b px-5 py-4 md:px-6">
        <LiveStepper frame={scene.stepFrame} />
      </div>
      <div className="grid gap-6 px-5 py-6 md:grid-cols-2 md:px-6">
        <div className="flex flex-col gap-6">
          <FocusField label="Environments" isFocused={isFocused("tags")}>
            <LiveTagsInput frame={scene.tagsFrame} />
          </FocusField>
          <FocusField isFocused={isFocused("replicas")}>
            <LiveNumberInput frame={scene.replicasFrame} />
          </FocusField>
          <FocusField label="Maintenance window" isFocused={false}>
            <DateRangeSpecimen />
          </FocusField>
        </div>
        <FocusField label="Build artifacts" isFocused={isFocused("artifacts")}>
          <LiveFileDropzone frame={scene.dropFrame} />
        </FocusField>
      </div>
      <div className="flex justify-end gap-2 border-t px-5 py-4 md:px-6">
        <Button variant="ghost">Cancel</Button>
        <DeployButton scene={scene} />
      </div>
    </div>
  )
}
