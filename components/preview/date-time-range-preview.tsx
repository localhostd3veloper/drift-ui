import { Label } from "@/registry/default/ui/label"
import { DateTimeRangePicker } from "@/registry/default/ui/date-time-range"

export function DateTimeRangePreview() {
  return (
    <>
      <div className="grid w-full max-w-sm gap-2">
        <Label htmlFor="preview-window">Maintenance window</Label>
        <DateTimeRangePicker id="preview-window" />
      </div>
    </>
  )
}
