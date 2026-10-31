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
import { DiffViewerPreview } from "@/components/preview/diff-viewer-preview"
import { DurationInputPreview } from "@/components/preview/duration-input-preview"
import { EmojiPickerPreview } from "@/components/preview/emoji-picker-preview"
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
import { PhoneInputCountriesPreview } from "@/components/preview/examples/phone-input-countries"
import { PhoneInputCustomCountriesPreview } from "@/components/preview/examples/phone-input-custom-countries"
import { PhoneInputDefaultCountryPreview } from "@/components/preview/examples/phone-input-default-country"
import { PhoneInputDisabledPreview } from "@/components/preview/examples/phone-input-disabled"
import { PhoneInputExcludedCountriesPreview } from "@/components/preview/examples/phone-input-excluded-countries"
import { PhoneInputFormPreview } from "@/components/preview/examples/phone-input-form"
import { PhoneInputValidationPreview } from "@/components/preview/examples/phone-input-validation"
import { PhoneInputPreview } from "@/components/preview/phone-input-preview"
import { RatingPreview } from "@/components/preview/rating-preview"
import { RecurrenceEditorPreview } from "@/components/preview/recurrence-editor-preview"
import { ShortcutRecorderPreview } from "@/components/preview/shortcut-recorder-preview"
import { SortableListPreview } from "@/components/preview/sortable-list-preview"
import { StepperPreview } from "@/components/preview/stepper-preview"
import { TagsInputPreview } from "@/components/preview/tags-input-preview"
import { TimeFieldPreview } from "@/components/preview/time-field-preview"
import { TimelinePreview } from "@/components/preview/timeline-preview"
import { TourPreview } from "@/components/preview/tour-preview"
import { TransferListPreview } from "@/components/preview/transfer-list-preview"
import { TreeViewPreview } from "@/components/preview/tree-view-preview"
import { VirtualListPreview } from "@/components/preview/virtual-list-preview"

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
  "diff-viewer": DiffViewerPreview,
  "duration-input": DurationInputPreview,
  "emoji-picker": EmojiPickerPreview,
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
  "phone-input": PhoneInputPreview,
  rating: RatingPreview,
  "recurrence-editor": RecurrenceEditorPreview,
  "shortcut-recorder": ShortcutRecorderPreview,
  "sortable-list": SortableListPreview,
  stepper: StepperPreview,
  "tags-input": TagsInputPreview,
  "time-field": TimeFieldPreview,
  timeline: TimelinePreview,
  tour: TourPreview,
  "transfer-list": TransferListPreview,
  "tree-view": TreeViewPreview,
  "virtual-list": VirtualListPreview,
}

export type ComponentExample = {
  id: string
  title: string
  description: string
  Preview: ComponentType
}

export const EXAMPLES: Record<string, ComponentExample[]> = {
  "phone-input": [
    {
      id: "phone-input-default-country",
      title: "Default country",
      description:
        "defaultCountry sets the starting country until the value or the person typing picks another one.",
      Preview: PhoneInputDefaultCountryPreview,
    },
    {
      id: "phone-input-countries",
      title: "Limit the country list",
      description:
        "countries lists only these, in this order. Numbers from anywhere else are rejected, so try pasting +49 151 23456789.",
      Preview: PhoneInputCountriesPreview,
    },
    {
      id: "phone-input-excluded-countries",
      title: "Exclude countries",
      description:
        "excludedCountries keeps every country except the ones you name.",
      Preview: PhoneInputExcludedCountriesPreview,
    },
    {
      id: "phone-input-custom-countries",
      title: "Custom names and flags",
      description:
        "Pass objects to translate names or replace the emoji flag with any React node. Windows browsers show emoji flags as two letters, so this is also how to use your own images.",
      Preview: PhoneInputCustomCountriesPreview,
    },
    {
      id: "phone-input-validation",
      title: "Validation",
      description:
        "PhoneInput does not validate, because the value is partial while typing. Check it with isValidPhoneNumber and pass the result to aria-invalid.",
      Preview: PhoneInputValidationPreview,
    },
    {
      id: "phone-input-form",
      title: "Forms",
      description:
        "name submits the E.164 value through a hidden input, so the server never sees the formatted text.",
      Preview: PhoneInputFormPreview,
    },
    {
      id: "phone-input-disabled",
      title: "Disabled",
      description: "disabled locks the field and the country button together.",
      Preview: PhoneInputDisabledPreview,
    },
  ],
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
