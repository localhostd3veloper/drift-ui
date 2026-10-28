import { DemoCard } from "@/components/landing/demo-card"
import { LiveDateRange } from "@/components/landing/live/live-date-range"
import { LiveFileDropzone } from "@/components/landing/live/live-file-dropzone"
import { LiveNumberInput } from "@/components/landing/live/live-number-input"
import { LivePasswordInput } from "@/components/landing/live/live-password-input"
import { LiveStepper } from "@/components/landing/live/live-stepper"
import { LiveTagsInput } from "@/components/landing/live/live-tags-input"
import { LiveTimeline } from "@/components/landing/live/live-timeline"
import { LiveTreeView } from "@/components/landing/live/live-tree-view"

export type LiveDemoKind =
  | "tags"
  | "tree"
  | "stepper"
  | "number"
  | "dropzone"
  | "timeline"
  | "password"
  | "date-range"

export function LiveDemoBody({ kind }: { kind: LiveDemoKind }) {
  switch (kind) {
    case "tags":
      return <LiveTagsInput />
    case "tree":
      return <LiveTreeView />
    case "stepper":
      return <LiveStepper />
    case "number":
      return <LiveNumberInput />
    case "dropzone":
      return <LiveFileDropzone />
    case "timeline":
      return <LiveTimeline />
    case "password":
      return <LivePasswordInput />
    case "date-range":
      return <LiveDateRange />
  }
}

export function LiveDemo({ kind }: { kind: LiveDemoKind }) {
  return (
    <DemoCard>
      <div aria-hidden inert>
        <LiveDemoBody kind={kind} />
      </div>
    </DemoCard>
  )
}
