import { DateTimeRangePicker } from "@/registry/default/ui/date-time-range"
import { Label } from "@/registry/default/ui/label"

export function DateTimeRangeSingleMonthPreview() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="range-single-month">Report period</Label>
      <DateTimeRangePicker
        id="range-single-month"
        numberOfMonths={1}
        placeholder="Choose a period"
      />
    </div>
  )
}
