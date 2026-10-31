import { Label } from "@/registry/default/ui/label"
import { NumberInput } from "@/registry/default/ui/number-input"

export function NumberInputDecimalsPreview() {
  return (
    <div className="grid w-40 gap-2">
      <Label htmlFor="number-decimals">CPU limit</Label>
      <NumberInput
        id="number-decimals"
        defaultValue={0.5}
        min={0.25}
        max={4}
        step={0.25}
        locale="en-US"
        formatOptions={{ minimumFractionDigits: 2 }}
      />
    </div>
  )
}
