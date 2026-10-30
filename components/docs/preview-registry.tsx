import type { ComponentType } from "react"

import { AvatarPreview as BaseUiAvatarPreview } from "@/components/preview/base/avatar-preview"
import { BadgePreview as BaseUiBadgePreview } from "@/components/preview/base/badge-preview"
import { BulkActionBarPreview as BaseUiBulkActionBarPreview } from "@/components/preview/base/bulk-action-bar-preview"
import { ButtonPreview as BaseUiButtonPreview } from "@/components/preview/base/button-preview"
import { DialogPreview as BaseUiDialogPreview } from "@/components/preview/base/dialog-preview"
import { LabelPreview as BaseUiLabelPreview } from "@/components/preview/base/label-preview"
import { MentionTextareaPreview as BaseUiMentionTextareaPreview } from "@/components/preview/base/mention-textarea-preview"
import { MultiSelectPreview as BaseUiMultiSelectPreview } from "@/components/preview/base/multi-select-preview"
import { PopoverPreview as BaseUiPopoverPreview } from "@/components/preview/base/popover-preview"
import { StepperPreview as BaseUiStepperPreview } from "@/components/preview/base/stepper-preview"
import { TourPreview as BaseUiTourPreview } from "@/components/preview/base/tour-preview"
import { AvatarGroupPreview } from "@/components/preview/avatar-group-preview"
import { AvatarPreview } from "@/components/preview/avatar-preview"
import { BadgePreview } from "@/components/preview/badge-preview"
import { BulkActionBarPreview } from "@/components/preview/bulk-action-bar-preview"
import { ButtonPreview } from "@/components/preview/button-preview"
import { CardPreview } from "@/components/preview/card-preview"
import { ColorPickerPreview } from "@/components/preview/color-picker-preview"
import { DateTimeRangePreview } from "@/components/preview/date-time-range-preview"
import { DescriptionListPreview } from "@/components/preview/description-list-preview"
import { DialogPreview } from "@/components/preview/dialog-preview"
import { FileDropzonePreview } from "@/components/preview/file-dropzone-preview"
import { FilterBuilderPreview } from "@/components/preview/filter-builder-preview"
import { InlineEditPreview } from "@/components/preview/inline-edit-preview"
import { InputPreview } from "@/components/preview/input-preview"
import { JsonViewerPreview } from "@/components/preview/json-viewer-preview"
import { LabelPreview } from "@/components/preview/label-preview"
import { MentionTextareaPreview } from "@/components/preview/mention-textarea-preview"
import { MultiSelectPreview } from "@/components/preview/multi-select-preview"
import { NumberInputPreview } from "@/components/preview/number-input-preview"
import { PasswordInputPreview } from "@/components/preview/password-input-preview"
import { PopoverPreview } from "@/components/preview/popover-preview"
import { RatingPreview } from "@/components/preview/rating-preview"
import { RecurrenceEditorPreview } from "@/components/preview/recurrence-editor-preview"
import { ShortcutRecorderPreview } from "@/components/preview/shortcut-recorder-preview"
import { StepperPreview } from "@/components/preview/stepper-preview"
import { TagsInputPreview } from "@/components/preview/tags-input-preview"
import { TimeFieldPreview } from "@/components/preview/time-field-preview"
import { TimelinePreview } from "@/components/preview/timeline-preview"
import { TourPreview } from "@/components/preview/tour-preview"
import { TreeViewPreview } from "@/components/preview/tree-view-preview"

export const PREVIEWS: Record<string, ComponentType> = {
  avatar: AvatarPreview,
  "avatar-group": AvatarGroupPreview,
  badge: BadgePreview,
  "bulk-action-bar": BulkActionBarPreview,
  button: ButtonPreview,
  card: CardPreview,
  "color-picker": ColorPickerPreview,
  "date-time-range": DateTimeRangePreview,
  "description-list": DescriptionListPreview,
  dialog: DialogPreview,
  "file-dropzone": FileDropzonePreview,
  "filter-builder": FilterBuilderPreview,
  "inline-edit": InlineEditPreview,
  input: InputPreview,
  "json-viewer": JsonViewerPreview,
  label: LabelPreview,
  "mention-textarea": MentionTextareaPreview,
  "multi-select": MultiSelectPreview,
  "number-input": NumberInputPreview,
  "password-input": PasswordInputPreview,
  popover: PopoverPreview,
  rating: RatingPreview,
  "recurrence-editor": RecurrenceEditorPreview,
  "shortcut-recorder": ShortcutRecorderPreview,
  stepper: StepperPreview,
  "tags-input": TagsInputPreview,
  "time-field": TimeFieldPreview,
  timeline: TimelinePreview,
  tour: TourPreview,
  "tree-view": TreeViewPreview,
}

export const BASE_UI_PREVIEWS: Record<string, ComponentType> = {
  avatar: BaseUiAvatarPreview,
  badge: BaseUiBadgePreview,
  "bulk-action-bar": BaseUiBulkActionBarPreview,
  button: BaseUiButtonPreview,
  dialog: BaseUiDialogPreview,
  label: BaseUiLabelPreview,
  "mention-textarea": BaseUiMentionTextareaPreview,
  "multi-select": BaseUiMultiSelectPreview,
  popover: BaseUiPopoverPreview,
  stepper: BaseUiStepperPreview,
  tour: BaseUiTourPreview,
}
