import { cn } from "@/registry/default/lib/utils"
import { Badge } from "@/registry/default/ui/badge"
import { Button } from "@/registry/default/ui/button"
import { Label } from "@/registry/default/ui/label"
import { DateRangeSpecimen } from "@/components/landing/specimens/date-range-specimen"
import { FileDropzoneSpecimen } from "@/components/landing/specimens/file-dropzone-specimen"
import { NumberInputSpecimen } from "@/components/landing/specimens/number-input-specimen"
import { StepperSpecimen } from "@/components/landing/specimens/stepper-specimen"
import { TagsInputSpecimen } from "@/components/landing/specimens/tags-input-specimen"
import { TimelineSpecimen } from "@/components/landing/specimens/timeline-specimen"
import { TreeViewSpecimen } from "@/components/landing/specimens/tree-view-specimen"

function PanelField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid content-start gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function ExplorerCard() {
  return (
    <div className="hidden flex-col gap-4 self-start rounded-2xl border bg-card/90 p-4 shadow-[0_32px_64px_-32px] shadow-black/15 lg:mt-16 lg:flex dark:shadow-black/80">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">ledgerline-web</span>
        <span className="font-mono text-[11px] text-muted-foreground">
          main
        </span>
      </div>
      <TreeViewSpecimen />
      <div className="border-t pt-4">
        <p className="mb-3 text-xs font-medium text-muted-foreground">
          Activity
        </p>
        <TimelineSpecimen />
      </div>
    </div>
  )
}

function DeployCard() {
  return (
    <div className="flex flex-col rounded-2xl border bg-card shadow-[0_40px_80px_-40px] shadow-black/20 dark:shadow-black">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 md:px-6">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">New deployment</span>
          <span className="text-xs text-muted-foreground">
            ledgerline-web, production
          </span>
        </div>
        <Badge variant="outline" className="gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          Ready
        </Badge>
      </div>
      <div className="border-b px-5 py-4 md:px-6">
        <StepperSpecimen />
      </div>
      <div className="grid gap-6 px-5 py-6 md:grid-cols-2 md:px-6">
        <div className="flex flex-col gap-5">
          <PanelField label="Environments">
            <TagsInputSpecimen />
          </PanelField>
          <PanelField label="Replicas">
            <NumberInputSpecimen />
          </PanelField>
          <PanelField label="Maintenance window">
            <DateRangeSpecimen />
          </PanelField>
        </div>
        <PanelField label="Build artifacts">
          <FileDropzoneSpecimen />
        </PanelField>
      </div>
      <div className="flex justify-end gap-2 border-t px-5 py-4 md:px-6">
        <Button variant="ghost">Cancel</Button>
        <Button>Deploy 3 replicas</Button>
      </div>
    </div>
  )
}

export function HeroPanel({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      inert
      className={cn(
        "relative rounded-[2rem] border bg-background bg-[radial-gradient(70%_60%_at_50%_0%,color-mix(in_oklab,var(--foreground)_9%,transparent),transparent)] p-3 md:p-10",
        className
      )}
    >
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[17rem_1fr]">
        <ExplorerCard />
        <DeployCard />
      </div>
    </div>
  )
}
