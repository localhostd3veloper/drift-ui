import { Label } from "@/registry/default/ui/label"
import { TimeField } from "@/registry/default/ui/time-field"

export function TimeFieldPreview() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Label>Standup, 24 hour</Label>
        <TimeField aria-label="Standup" defaultValue="09:30" minuteStep={5} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Deploy window, 12 hour</Label>
        <TimeField aria-label="Deploy window" hourCycle={12} />
      </div>
    </>
  )
}
