import { DateTimeRangePicker } from "@/registry/default/ui/date-time-range"
import { Label } from "@/registry/default/ui/label"

export function DateTimeRangeLocalePreview() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="range-locale">Wartungsfenster</Label>
      <DateTimeRangePicker
        id="range-locale"
        locale="de-DE"
        placeholder="Zeitraum wählen"
      />
    </div>
  )
}
