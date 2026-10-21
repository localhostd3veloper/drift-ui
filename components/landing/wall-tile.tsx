import { ArrowRightIcon } from "lucide-react"

import { Badge } from "@/registry/default/ui/badge"
import { Button } from "@/registry/default/ui/button"
import { Input } from "@/registry/default/ui/input"
import { Label } from "@/registry/default/ui/label"
import { DemoCard } from "@/components/landing/demo-card"
import { DateRangeSpecimen } from "@/components/landing/specimens/date-range-specimen"
import { FileDropzoneSpecimen } from "@/components/landing/specimens/file-dropzone-specimen"
import { NumberInputSpecimen } from "@/components/landing/specimens/number-input-specimen"
import { PasswordInputSpecimen } from "@/components/landing/specimens/password-input-specimen"
import { StepperSpecimen } from "@/components/landing/specimens/stepper-specimen"
import { TagsInputSpecimen } from "@/components/landing/specimens/tags-input-specimen"
import { TimelineSpecimen } from "@/components/landing/specimens/timeline-specimen"
import { TreeViewSpecimen } from "@/components/landing/specimens/tree-view-specimen"

export type WallTileKind =
  | "tags"
  | "stepper"
  | "tree"
  | "number"
  | "dropzone"
  | "timeline"
  | "password"
  | "date-range"
  | "buttons"
  | "badges"
  | "field"
  | "confirm"

function WallTileBody({ kind }: { kind: WallTileKind }) {
  switch (kind) {
    case "tags":
      return <TagsInputSpecimen />
    case "stepper":
      return <StepperSpecimen />
    case "tree":
      return <TreeViewSpecimen />
    case "number":
      return (
        <div className="flex items-center justify-between gap-4">
          <Label>Replicas</Label>
          <NumberInputSpecimen />
        </div>
      )
    case "dropzone":
      return <FileDropzoneSpecimen />
    case "timeline":
      return <TimelineSpecimen />
    case "password":
      return <PasswordInputSpecimen />
    case "date-range":
      return <DateRangeSpecimen />
    case "buttons":
      return (
        <div className="flex flex-wrap gap-2">
          <Button size="sm">
            Continue <ArrowRightIcon />
          </Button>
          <Button size="sm" variant="outline">
            Cancel
          </Button>
        </div>
      )
    case "badges":
      return (
        <div className="flex flex-wrap gap-1.5">
          <Badge>Shipped</Badge>
          <Badge variant="secondary">v0.4.1</Badge>
          <Badge variant="outline">2 blocking</Badge>
        </div>
      )
    case "field":
      return (
        <div className="grid gap-2">
          <Label>Workspace URL</Label>
          <Input readOnly value="ledgerline.dev/ops" />
        </div>
      )
    case "confirm":
      return (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold">Rotate API key?</p>
            <p className="text-xs text-muted-foreground">
              Existing integrations stop working until updated.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost">
              Keep
            </Button>
            <Button size="sm" variant="destructive">
              Rotate
            </Button>
          </div>
        </div>
      )
  }
}

export function WallTile({ kind }: { kind: WallTileKind }) {
  return (
    <DemoCard>
      <WallTileBody kind={kind} />
    </DemoCard>
  )
}
