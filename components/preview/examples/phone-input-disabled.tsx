import { Label } from "@/registry/default/ui/label"
import { PhoneInput } from "@/registry/default/ui/phone-input"

export function PhoneInputDisabledPreview() {
  return (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="phone-disabled">Verified number</Label>
      <PhoneInput id="phone-disabled" defaultValue="+442079460958" disabled />
    </div>
  )
}
