import { Label } from "@/registry/default/ui/label"
import { PhoneInput } from "@/registry/default/ui/phone-input"

export function PhoneInputCountriesPreview() {
  return (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="phone-countries">Support line</Label>
      <PhoneInput id="phone-countries" countries={["US", "CA", "GB", "IN"]} />
    </div>
  )
}
