import { DurationInput } from "@/registry/default/ui/duration-input"
import { Label } from "@/registry/default/ui/label"

export function DurationInputUnitsPreview() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Retention</Label>
        <DurationInput
          aria-label="Retention"
          units={["w", "d"]}
          defaultValue={1_209_600_000}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Request timeout</Label>
        <DurationInput
          aria-label="Request timeout"
          units={["s", "ms"]}
          defaultValue={2_500}
        />
      </div>
    </div>
  )
}
