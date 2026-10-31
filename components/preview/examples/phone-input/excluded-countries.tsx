import { Label } from "@/registry/default/ui/label"
import { PhoneInput } from "@/registry/default/ui/phone-input"

export function PhoneInputExcludedCountriesPreview() {
  return (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="phone-excluded">Billing contact</Label>
      <PhoneInput id="phone-excluded" excludedCountries={["CU", "KP"]} />
    </div>
  )
}
