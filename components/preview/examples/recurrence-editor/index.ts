import { RecurrenceEditorControlledPreview } from "@/components/preview/examples/recurrence-editor/controlled"
import { RecurrenceEditorEndsAfterPreview } from "@/components/preview/examples/recurrence-editor/ends-after"
import { RecurrenceEditorMonthlyPreview } from "@/components/preview/examples/recurrence-editor/monthly"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "monthly",
    title: "Monthly by weekday",
    description:
      "An ordinal in BYDAY means the nth weekday, so 1MO is the first Monday of each month.",
    Preview: RecurrenceEditorMonthlyPreview,
  },
  {
    id: "ends-after",
    title: "Ends after a count",
    description:
      "COUNT stops the rule after that many occurrences, and the editor shows it as the end option.",
    Preview: RecurrenceEditorEndsAfterPreview,
  },
  {
    id: "controlled",
    title: "Read the rule",
    description:
      "onValueChange gives you an RRULE string to store. parseRRule and describeRecurrence from the recurrence lib turn it back into a sentence anywhere else.",
    Preview: RecurrenceEditorControlledPreview,
  },
]
