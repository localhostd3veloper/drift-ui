import { DurationInput } from "@/registry/default/ui/duration-input"
import { Label } from "@/registry/default/ui/label"

export function DurationInputLimitsPreview() {
  return (
    <div className="flex flex-col gap-2">
      <Label>Session length</Label>
      <DurationInput
        aria-label="Session length"
        units={["h", "m"]}
        defaultValue={1_800_000}
        min={300_000}
        max={14_400_000}
        step={5}
      />
      <p className="text-xs text-muted-foreground">
        Between 5 minutes and 4 hours.
      </p>
    </div>
  )
}
