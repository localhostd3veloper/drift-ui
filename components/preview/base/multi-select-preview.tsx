import { Label } from "@/registry/base/ui/label"
import { MultiSelect } from "@/registry/base/ui/multi-select"

const REGIONS = [
  { value: "eu-west-1", label: "Ireland", group: "Europe" },
  { value: "eu-central-1", label: "Frankfurt", group: "Europe" },
  { value: "eu-north-1", label: "Stockholm", group: "Europe" },
  { value: "us-east-1", label: "Virginia", group: "Americas" },
  { value: "us-west-2", label: "Oregon", group: "Americas" },
  { value: "sa-east-1", label: "São Paulo", group: "Americas" },
  { value: "ap-south-1", label: "Mumbai", group: "Asia Pacific" },
  { value: "ap-northeast-1", label: "Tokyo", group: "Asia Pacific" },
]

export function MultiSelectPreview() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="regions">Regions</Label>
      <MultiSelect
        id="regions"
        options={REGIONS}
        defaultValue={["eu-west-1", "us-east-1"]}
        placeholder="Pick regions"
        maxVisibleChips={3}
      />
    </div>
  )
}
