import type { ComponentType } from "react"

import { DialogPreview as BaseUiDialogPreview } from "@/components/preview/base/dialog-preview"
import { PopoverPreview as BaseUiPopoverPreview } from "@/components/preview/base/popover-preview"
import { BadgePreview } from "@/components/preview/badge-preview"
import { BulkActionBarPreview } from "@/components/preview/bulk-action-bar-preview"
import { ButtonPreview } from "@/components/preview/button-preview"
import { CardPreview } from "@/components/preview/card-preview"
import { ColorPickerPreview } from "@/components/preview/color-picker-preview"
import { DateTimeRangePreview } from "@/components/preview/date-time-range-preview"
import { DialogPreview } from "@/components/preview/dialog-preview"
import { FileDropzonePreview } from "@/components/preview/file-dropzone-preview"
import { FilterBuilderPreview } from "@/components/preview/filter-builder-preview"
import { InlineEditPreview } from "@/components/preview/inline-edit-preview"
import { InputPreview } from "@/components/preview/input-preview"
import { LabelPreview } from "@/components/preview/label-preview"
import { MentionTextareaPreview } from "@/components/preview/mention-textarea-preview"
import { NumberInputPreview } from "@/components/preview/number-input-preview"
import { PasswordInputPreview } from "@/components/preview/password-input-preview"
import { PopoverPreview } from "@/components/preview/popover-preview"
import { ShortcutRecorderPreview } from "@/components/preview/shortcut-recorder-preview"
import { StepperPreview } from "@/components/preview/stepper-preview"
import { TagsInputPreview } from "@/components/preview/tags-input-preview"
import { TimeFieldPreview } from "@/components/preview/time-field-preview"
import { TimelinePreview } from "@/components/preview/timeline-preview"
import { TourPreview } from "@/components/preview/tour-preview"
import { TreeViewPreview } from "@/components/preview/tree-view-preview"

export const PREVIEWS: Record<string, ComponentType> = {
  badge: BadgePreview,
  "bulk-action-bar": BulkActionBarPreview,
  button: ButtonPreview,
  card: CardPreview,
  "color-picker": ColorPickerPreview,
  "date-time-range": DateTimeRangePreview,
  dialog: DialogPreview,
  "file-dropzone": FileDropzonePreview,
  "filter-builder": FilterBuilderPreview,
  "inline-edit": InlineEditPreview,
  input: InputPreview,
  label: LabelPreview,
  "mention-textarea": MentionTextareaPreview,
  "number-input": NumberInputPreview,
  "password-input": PasswordInputPreview,
  popover: PopoverPreview,
  "shortcut-recorder": ShortcutRecorderPreview,
  stepper: StepperPreview,
  "tags-input": TagsInputPreview,
  "time-field": TimeFieldPreview,
  timeline: TimelinePreview,
  tour: TourPreview,
  "tree-view": TreeViewPreview,
}

export const BASE_UI_PREVIEWS: Record<string, ComponentType> = {
  dialog: BaseUiDialogPreview,
  popover: BaseUiPopoverPreview,
}
