import { PhoneInputCountriesPreview } from "@/components/preview/examples/phone-input/countries"
import { PhoneInputCustomCountriesPreview } from "@/components/preview/examples/phone-input/custom-countries"
import { PhoneInputDefaultCountryPreview } from "@/components/preview/examples/phone-input/default-country"
import { PhoneInputDisabledPreview } from "@/components/preview/examples/phone-input/disabled"
import { PhoneInputExcludedCountriesPreview } from "@/components/preview/examples/phone-input/excluded-countries"
import { PhoneInputFormPreview } from "@/components/preview/examples/phone-input/form"
import { PhoneInputValidationPreview } from "@/components/preview/examples/phone-input/validation"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "default-country",
    title: "Default country",
    description:
      "defaultCountry sets the starting country until the value or the person typing picks another one.",
    Preview: PhoneInputDefaultCountryPreview,
  },
  {
    id: "countries",
    title: "Limit the country list",
    description:
      "countries lists only these, in this order. Numbers from anywhere else are rejected, so try pasting +49 151 23456789.",
    Preview: PhoneInputCountriesPreview,
  },
  {
    id: "excluded-countries",
    title: "Exclude countries",
    description:
      "excludedCountries keeps every country except the ones you name.",
    Preview: PhoneInputExcludedCountriesPreview,
  },
  {
    id: "custom-countries",
    title: "Custom names and flags",
    description:
      "Pass objects to translate names or replace the emoji flag with any React node. Windows browsers show emoji flags as two letters, so this is also how to use your own images.",
    Preview: PhoneInputCustomCountriesPreview,
  },
  {
    id: "validation",
    title: "Validation",
    description:
      "PhoneInput does not validate, because the value is partial while typing. Check it with isValidPhoneNumber and pass the result to aria-invalid.",
    Preview: PhoneInputValidationPreview,
  },
  {
    id: "form",
    title: "Forms",
    description:
      "name submits the E.164 value through a hidden input, so the server never sees the formatted text.",
    Preview: PhoneInputFormPreview,
  },
  {
    id: "disabled",
    title: "Disabled",
    description: "disabled locks the field and the country button together.",
    Preview: PhoneInputDisabledPreview,
  },
]
