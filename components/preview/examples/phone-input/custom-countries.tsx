import { Label } from "@/registry/default/ui/label"
import {
  PhoneInput,
  type PhoneCountryOption,
} from "@/registry/default/ui/phone-input"

function CountryTag({ code }: { code: string }) {
  return <span className="font-mono text-xs">{code}</span>
}

const DACH_COUNTRIES: PhoneCountryOption[] = [
  { code: "DE", name: "Deutschland", flag: <CountryTag code="DE" /> },
  { code: "AT", name: "Österreich", flag: <CountryTag code="AT" /> },
  { code: "CH", name: "Schweiz", flag: <CountryTag code="CH" /> },
]

export function PhoneInputCustomCountriesPreview() {
  return (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="phone-custom">Telefonnummer</Label>
      <PhoneInput id="phone-custom" countries={DACH_COUNTRIES} />
    </div>
  )
}
