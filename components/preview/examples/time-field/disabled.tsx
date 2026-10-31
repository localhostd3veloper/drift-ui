import { Label } from "@/registry/default/ui/label"
import { TimeField } from "@/registry/default/ui/time-field"

export function TimeFieldDisabledPreview() {
  return (
    <div className="flex flex-col gap-2">
      <Label>Quiet hours start</Label>
      <TimeField aria-label="Quiet hours start" defaultValue="22:00" disabled />
    </div>
  )
}
