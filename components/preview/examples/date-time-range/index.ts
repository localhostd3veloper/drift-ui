import { DateTimeRangeControlledPreview } from "@/components/preview/examples/date-time-range/controlled"
import { DateTimeRangeLocalePreview } from "@/components/preview/examples/date-time-range/locale"
import { DateTimeRangeSingleMonthPreview } from "@/components/preview/examples/date-time-range/single-month"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "controlled",
    title: "Controlled",
    description:
      "value and onValueChange hold the range as two Date objects, with the chosen times applied.",
    Preview: DateTimeRangeControlledPreview,
  },
  {
    id: "single-month",
    title: "One month",
    description:
      "numberOfMonths={1} keeps the popover narrow for sidebars and small screens.",
    Preview: DateTimeRangeSingleMonthPreview,
  },
  {
    id: "locale",
    title: "Locale",
    description:
      "locale formats the trigger label. Pick a range to see German dates.",
    Preview: DateTimeRangeLocalePreview,
  },
]
