import { Label } from "@/registry/default/ui/label"
import { PhoneInput } from "@/registry/default/ui/phone-input"

export function PhoneInputDefaultCountryPreview() {
  return (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="phone-default-country">Mobile number</Label>
      <PhoneInput id="phone-default-country" defaultCountry="IN" />
    </div>
  )
}
