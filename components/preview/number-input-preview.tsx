import { Label } from "@/registry/default/ui/label"
import { NumberInput } from "@/registry/default/ui/number-input"

export function NumberInputPreview() {
  return (
    <>
      <div className="grid w-40 gap-2">
        <Label htmlFor="preview-replicas">Replicas</Label>
        <NumberInput id="preview-replicas" defaultValue={3} min={1} max={12} />
      </div>
      <div className="grid w-48 gap-2">
        <Label htmlFor="preview-budget">Monthly budget</Label>
        <NumberInput
          id="preview-budget"
          defaultValue={1240.5}
          min={0}
          step={10}
          locale="de-DE"
          formatOptions={{ style: "currency", currency: "EUR" }}
        />
      </div>
    </>
  )
}
