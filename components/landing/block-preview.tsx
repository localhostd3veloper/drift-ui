import { ChevronDownIcon, LaptopIcon, SmartphoneIcon } from "lucide-react"

import { Button } from "@/registry/default/ui/button"
import { Label } from "@/registry/default/ui/label"
import { DateRangeSpecimen } from "@/components/landing/specimens/date-range-specimen"
import { FileDropzoneSpecimen } from "@/components/landing/specimens/file-dropzone-specimen"
import { NumberInputSpecimen } from "@/components/landing/specimens/number-input-specimen"
import { PasswordInputSpecimen } from "@/components/landing/specimens/password-input-specimen"
import { StepperSpecimen } from "@/components/landing/specimens/stepper-specimen"
import { TagsInputSpecimen } from "@/components/landing/specimens/tags-input-specimen"
import { TimelineSpecimen } from "@/components/landing/specimens/timeline-specimen"
import { TreeViewSpecimen } from "@/components/landing/specimens/tree-view-specimen"
import type { BlockKind } from "@/lib/blocks"

const SESSIONS = [
  { device: "MacBook Pro, Lisbon", meta: "This device", Icon: LaptopIcon },
  { device: "Pixel 9, Porto", meta: "2 hours ago", Icon: SmartphoneIcon },
]

function BlockTitle({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-medium">{title}</span>
      <span className="text-xs text-muted-foreground">{detail}</span>
    </div>
  )
}

export function BlockPreview({ kind }: { kind: BlockKind }) {
  switch (kind) {
    case "onboarding":
      return (
        <div className="flex flex-col gap-5">
          <StepperSpecimen />
          <div className="grid gap-2">
            <Label>Teams</Label>
            <TagsInputSpecimen tags={["platform", "design"]} draft="Add team" />
          </div>
          <div className="flex items-end justify-between gap-4">
            <div className="grid gap-2">
              <Label>Seats</Label>
              <NumberInputSpecimen />
            </div>
            <Button size="sm">Continue</Button>
          </div>
        </div>
      )
    case "team-invite":
      return (
        <div className="flex flex-col gap-4">
          <BlockTitle
            title="Invite your team"
            detail="They get an email with a join link."
          />
          <TagsInputSpecimen
            tags={["ilse@ledgerline.dev", "noor@ledgerline.dev"]}
            draft="Add email"
          />
          <div className="flex items-center justify-between">
            <span className="flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs">
              Member{" "}
              <ChevronDownIcon className="size-3.5 text-muted-foreground" />
            </span>
            <Button size="sm">Send 2 invites</Button>
          </div>
        </div>
      )
    case "security":
      return (
        <div className="flex flex-col gap-4">
          <BlockTitle
            title="Change password"
            detail="Signs out every other session."
          />
          <PasswordInputSpecimen />
          <ul className="flex flex-col divide-y rounded-md border">
            {SESSIONS.map(({ device, meta, Icon }) => (
              <li
                key={device}
                className="flex items-center gap-2.5 px-3 py-2 text-xs"
              >
                <Icon className="size-4 text-muted-foreground" />
                <span className="flex-1">{device}</span>
                <span className="text-muted-foreground">{meta}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    case "file-manager":
      return (
        <div className="grid gap-4 @md:grid-cols-[1fr_1.2fr]">
          <TreeViewSpecimen />
          <FileDropzoneSpecimen />
        </div>
      )
    case "release":
      return (
        <div className="grid gap-5">
          <BlockTitle title="Schedule release" detail="v2.14.0 to production" />
          <DateRangeSpecimen />
          <TimelineSpecimen />
        </div>
      )
    case "audit-log":
      return (
        <div className="flex flex-col gap-4">
          <TagsInputSpecimen
            tags={["actor:noor", "action:deploy"]}
            draft="Add filter"
          />
          <TimelineSpecimen />
        </div>
      )
  }
}
