type ComponentUsage = {
  notes: string
  example?: string
}

const SAME_AS_SHADCN =
  "Identical API to the shadcn/ui component of the same name. Skip it if the project already has one."

export const COMPONENT_USAGE: Record<string, ComponentUsage> = {
  utils: {
    notes:
      "Installs lib/utils.ts with the cn() class merging helper. Every component depends on it.",
  },
  theme: {
    notes:
      "Neutral oklch tokens for light and dark mode, written into the project's global CSS. Optional: components read whatever tokens the project already has.",
  },
  button: { notes: SAME_AS_SHADCN },
  badge: { notes: SAME_AS_SHADCN },
  input: { notes: SAME_AS_SHADCN },
  label: { notes: SAME_AS_SHADCN },
  card: { notes: SAME_AS_SHADCN },
  dialog: { notes: SAME_AS_SHADCN },
  popover: { notes: SAME_AS_SHADCN },
  "use-controllable-state": {
    notes:
      "Hook shared by several components to support both controlled (value + onValueChange) and uncontrolled (defaultValue) use. Installed automatically as a dependency.",
  },
  "tags-input": {
    notes:
      "Controlled with value/onValueChange or uncontrolled with defaultValue. Enter or comma adds a tag, Backspace or ArrowLeft with the caret at the start selects a tag (announced to screen readers), a second Backspace removes it, pasting splits on commas, tabs and newlines. Props: max (the field turns read-only when full, so tags stay removable by keyboard), validate(tag) => boolean, allowDuplicates, addOnBlur. Spreads remaining props onto the inner input, so id, placeholder and aria-invalid work.",
    example: `import { Label } from "@/components/ui/label"
import { TagsInput } from "@/components/ui/tags-input"

export function EnvironmentsField() {
  return (
    <div className="grid gap-2">
      <Label htmlFor="environments">Environments</Label>
      <TagsInput id="environments" defaultValue={["staging"]} max={6} placeholder="Add environment" />
    </div>
  )
}`,
  },
  "tree-view": {
    notes:
      "WAI-ARIA tree driven by an items array of TreeNode { id, label, icon?, children?, isBranch?, disabled?, textValue? }. expanded/onExpandedChange and selected/onSelectedChange are optional controlled props. A node with isBranch: true and children undefined renders a loading row while expanded, so load children in onExpandedChange and update items. Always pass aria-label.",
    example: `import { TreeView, type TreeNode } from "@/components/ui/tree-view"

const items: TreeNode[] = [
  { id: "app", label: "app", children: [{ id: "app/page", label: "page.tsx" }] },
  { id: "archive", label: "archive", isBranch: true },
]

export function ProjectTree() {
  return <TreeView aria-label="Project files" items={items} defaultExpanded={["app"]} />
}`,
  },
  stepper: {
    notes:
      "Built on Radix Tabs, or Base UI Tabs from the Base UI registry. Steps are zero-based numbers: value/defaultValue/onValueChange. linear disables steps beyond the furthest one reached. Compose StepperList > StepperItem(step) > StepperTrigger > StepperIndicator + StepperTitle, plus StepperSeparator and StepperContent(step). StepperNext and StepperPrevious support asChild; pass stepCount so Next disables on the last step. useStepper() exposes activeStep and setActiveStep.",
    example: `import { Button } from "@/components/ui/button"
import {
  Stepper, StepperContent, StepperIndicator, StepperItem, StepperList,
  StepperNext, StepperPrevious, StepperSeparator, StepperTitle, StepperTrigger,
} from "@/components/ui/stepper"

const steps = ["Account", "Workspace", "Invite"]

export function OnboardingSteps() {
  return (
    <Stepper linear stepCount={steps.length}>
      <StepperList aria-label="Onboarding">
        {steps.map((title, index) => (
          <StepperItem key={title} step={index}>
            <StepperTrigger>
              <StepperIndicator />
              <StepperTitle>{title}</StepperTitle>
            </StepperTrigger>
            <StepperSeparator />
          </StepperItem>
        ))}
      </StepperList>
      {steps.map((title, index) => (
        <StepperContent key={title} step={index}>{title} form goes here</StepperContent>
      ))}
      <div className="flex justify-between">
        <StepperPrevious asChild><Button variant="outline">Back</Button></StepperPrevious>
        <StepperNext asChild><Button>Continue</Button></StepperNext>
      </div>
    </Stepper>
  )
}`,
  },
  "number-input": {
    notes:
      "Value is number | null. Props: min, max, step, locale, formatOptions (Intl.NumberFormatOptions, e.g. currency), name (submits the raw number through a hidden input). Arrow keys step, Shift or PageUp/PageDown step by 10x, Home/End jump to min/max. Typed text is parsed with the locale's separators.",
    example: `import { NumberInput } from "@/components/ui/number-input"

export function BudgetField() {
  return (
    <NumberInput
      aria-label="Monthly budget"
      defaultValue={1240.5}
      min={0}
      step={10}
      locale="de-DE"
      formatOptions={{ style: "currency", currency: "EUR" }}
    />
  )
}`,
  },
  "file-dropzone": {
    notes:
      "FileDropzone validates accept (extensions, MIME types, image/*), maxSize in bytes and maxFiles, then calls onFilesAccepted(files) and onFilesRejected(rejections) where each rejection has { file, reason: 'type' | 'size' | 'count' }. It does not upload or store files: keep the list in your own state and render FileDropzoneList > FileDropzoneItem(name, size, progress?, error?, onRemove?). formatBytes is exported.",
    example: `"use client"

import { useState } from "react"
import { FileDropzone, FileDropzoneItem, FileDropzoneList } from "@/components/ui/file-dropzone"

export function AttachmentsField() {
  const [files, setFiles] = useState<File[]>([])

  return (
    <div className="grid gap-3">
      <FileDropzone accept=".pdf,image/*" maxSize={10 * 1024 * 1024} onFilesAccepted={(added) => setFiles((current) => [...current, ...added])} />
      <FileDropzoneList>
        {files.map((file) => (
          <FileDropzoneItem key={file.name} name={file.name} size={file.size} onRemove={() => setFiles((current) => current.filter((item) => item !== file))} />
        ))}
      </FileDropzoneList>
    </div>
  )
}`,
  },
  timeline: {
    notes:
      "Presentational and server-component safe. TimelineIndicator takes variant: default | current | success | destructive. Wrap text in TimelineContent, with TimelineHeader holding TimelineTitle and TimelineTime.",
    example: `import {
  Timeline, TimelineContent, TimelineDescription, TimelineHeader,
  TimelineIndicator, TimelineItem, TimelineTime, TimelineTitle,
} from "@/components/ui/timeline"

export function DeployHistory() {
  return (
    <Timeline>
      <TimelineItem>
        <TimelineIndicator variant="current" />
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Deployed to production</TimelineTitle>
            <TimelineTime dateTime="2026-10-27T14:32">14:32</TimelineTime>
          </TimelineHeader>
          <TimelineDescription>v2.14.0 rolled out to 3 replicas.</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}`,
  },
  "password-input": {
    notes:
      "PasswordInput accepts every input prop except type and adds an accessible reveal toggle. PasswordStrength takes value and renders a 4 segment meter with a polite live region; override scoring with getScore(value) => 0 | 1 | 2 | 3 | 4 and labels with a 5 item tuple.",
    example: `"use client"

import { useState } from "react"
import { PasswordInput, PasswordStrength } from "@/components/ui/password-input"

export function NewPasswordField() {
  const [password, setPassword] = useState("")

  return (
    <div className="grid gap-2">
      <PasswordInput autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} />
      <PasswordStrength value={password} />
    </div>
  )
}`,
  },
  "date-time-range": {
    notes:
      "DateTimeRangePicker with value/defaultValue of { from?: Date, to?: Date } and onValueChange. Start and end times default to 09:00 and 17:00 and are edited in the popover. Installs the shadcn calendar and popover. Props: locale, placeholder, numberOfMonths, disabled, id.",
    example: `import { DateTimeRangePicker } from "@/components/ui/date-time-range"

export function MaintenanceWindowField() {
  return <DateTimeRangePicker id="maintenance-window" placeholder="Pick a maintenance window" />
}`,
  },
  "filter-builder": {
    notes:
      "Chip based filters. fields: FilterField[] with { id, label, type: 'text' | 'number' | 'select', options? }. Value is Filter[] ({ id, fieldId, operator, value }). Use matchesFilter(fieldValue, filter) from @/lib/filter to apply filters to your rows.",
    example: `"use client"

import { useState } from "react"
import { FilterBuilder } from "@/components/ui/filter-builder"
import { matchesFilter, type Filter, type FilterField } from "@/lib/filter"

const fields: FilterField[] = [
  { id: "status", label: "Status", type: "select", options: [{ value: "open", label: "Open" }, { value: "closed", label: "Closed" }] },
  { id: "title", label: "Title", type: "text" },
]

export function IssueFilters({ issues }: { issues: { status: string; title: string }[] }) {
  const [filters, setFilters] = useState<Filter[]>([])
  const visible = issues.filter((issue) => filters.every((filter) => matchesFilter(issue[filter.fieldId as "status" | "title"], filter)))

  return (
    <div className="grid gap-3">
      <FilterBuilder fields={fields} value={filters} onValueChange={setFilters} />
      <p className="text-sm text-muted-foreground">{visible.length} issues</p>
    </div>
  )
}`,
  },
  tour: {
    notes:
      "Wrap the page in Tour with steps: TourStep[] ({ target, title, description?, side? }) and mark elements with TourTarget name matching step.target. open/onOpenChange and step/onStepChange are optional controlled props; onComplete fires after the last step. Focus is trapped in the tour card and returns to the opener on close.",
    example: `"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tour, TourTarget, type TourStep } from "@/components/ui/tour"

const steps: TourStep[] = [{ target: "create", title: "Create a project", description: "Start here." }]

export function DashboardTour() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Tour steps={steps} open={isOpen} onOpenChange={setIsOpen}>
      <TourTarget name="create"><Button>New project</Button></TourTarget>
      <Button variant="ghost" onClick={() => setIsOpen(true)}>Take the tour</Button>
    </Tour>
  )
}`,
  },
  "bulk-action-bar": {
    notes:
      "Floating toolbar (Radix or Base UI) that animates in when selectedCount > 0. Props: selectedCount, onClear (also bound to Escape), placement: 'viewport' (portaled, default) or 'container' (absolute inside a relative parent). Put BulkActionBarButton children inside. Requires the motion package.",
    example: `import { BulkActionBar, BulkActionBarButton } from "@/components/ui/bulk-action-bar"

export function FileActions({ selected, onClear }: { selected: string[]; onClear: () => void }) {
  return (
    <BulkActionBar selectedCount={selected.length} onClear={onClear}>
      <BulkActionBarButton>Move</BulkActionBarButton>
      <BulkActionBarButton variant="destructive">Delete</BulkActionBarButton>
    </BulkActionBar>
  )
}`,
  },
  "color-picker": {
    notes:
      "Popover picker with a saturation and brightness area, hue and alpha sliders, hex input, oklch readout and the native EyeDropper where supported. Value is a hex string (#rrggbb or #rrggbbaa). Props: value/defaultValue/onValueChange, showAlpha, swatches.",
    example: `import { ColorPicker } from "@/components/ui/color-picker"

export function BrandColorField() {
  return <ColorPicker aria-label="Brand color" defaultValue="#6366f1" swatches={["#0f172a", "#6366f1", "#10b981"]} />
}`,
  },
  "shortcut-recorder": {
    notes:
      "Click to record, then press a combination. Stores a portable string such as 'Mod+Shift+K' where Mod is Cmd on macOS and Ctrl elsewhere. requireModifier defaults to true. ShortcutKeys renders a stored shortcut as kbd elements; matchesShortcut(event, shortcut, isMac) from @/lib/shortcut checks key events.",
    example: `import { ShortcutKeys, ShortcutRecorder } from "@/components/ui/shortcut-recorder"

export function CommandMenuShortcut() {
  return (
    <div className="flex items-center gap-3">
      <ShortcutRecorder aria-label="Command menu shortcut" defaultValue="Mod+K" />
      <ShortcutKeys shortcut="Mod+Shift+P" />
    </div>
  )
}`,
  },
  "mention-textarea": {
    notes:
      "Textarea that opens a suggestion list when the caret follows a trigger character. triggers maps a character to options, for example { '@': people, '#': channels }, each option { value, label, description? }. Selecting inserts trigger + value. Value is plain text with value/defaultValue/onValueChange.",
    example: `import { MentionTextarea } from "@/components/ui/mention-textarea"

const people = [{ value: "noor", label: "Noor Haddad" }, { value: "tomasz", label: "Tomasz Wierzba" }]

export function CommentBox() {
  return <MentionTextarea aria-label="Comment" placeholder="Write a comment" triggers={{ "@": people }} />
}`,
  },
  "time-field": {
    notes:
      "Segmented time input with value 'HH:mm' in 24 hour time (empty string when unset). hourCycle 12 adds an AM/PM segment, minuteStep sets the arrow key step, name submits through a hidden input. The root is role=group, so pass aria-label or aria-labelledby.",
    example: `import { TimeField } from "@/components/ui/time-field"

export function StandupTimeField() {
  return <TimeField aria-label="Standup time" defaultValue="09:30" hourCycle={12} minuteStep={15} />
}`,
  },
  "inline-edit": {
    notes:
      "Click to edit, Enter or blur saves, Escape cancels. value is required and onSave(value) may return a promise; while it is pending the field is read only, and a rejected promise marks it invalid and keeps it open. Pass aria-label describing the field.",
    example: `"use client"

import { useState } from "react"
import { InlineEdit } from "@/components/ui/inline-edit"

export function ProjectName() {
  const [name, setName] = useState("Billing migration")
  return <InlineEdit aria-label="Project name" value={name} onSave={setName} />
}`,
  },
}
