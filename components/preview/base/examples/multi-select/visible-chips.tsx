import { Label } from "@/registry/base/ui/label"
import { MultiSelect } from "@/registry/base/ui/multi-select"

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "de", label: "German" },
  { value: "fr", label: "French" },
  { value: "hi", label: "Hindi" },
  { value: "ja", label: "Japanese" },
]

export function MultiSelectVisibleChipsPreview() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="multi-select-chips">Languages</Label>
      <MultiSelect
        id="multi-select-chips"
        options={LANGUAGES}
        defaultValue={["en", "de", "fr", "hi"]}
        maxVisibleChips={2}
      />
    </div>
  )
}
