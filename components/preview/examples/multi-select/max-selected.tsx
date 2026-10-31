import { Label } from "@/registry/default/ui/label"
import { MultiSelect } from "@/registry/default/ui/multi-select"

const PLANS = [
  { value: "starter", label: "Starter" },
  { value: "team", label: "Team" },
  { value: "business", label: "Business" },
  { value: "enterprise", label: "Enterprise" },
]

export function MultiSelectMaxSelectedPreview() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="multi-select-limit">Compare up to two plans</Label>
      <MultiSelect
        id="multi-select-limit"
        options={PLANS}
        defaultValue={["team"]}
        maxSelected={2}
      />
    </div>
  )
}
