import { Label } from "@/registry/default/ui/label"
import { TagsInput } from "@/registry/default/ui/tags-input"

export function TagsInputDuplicatesPreview() {
  return (
    <div className="grid w-full max-w-md gap-2">
      <Label htmlFor="tags-duplicates">Pipeline steps</Label>
      <TagsInput
        id="tags-duplicates"
        defaultValue={["lint", "test", "lint"]}
        allowDuplicates
      />
    </div>
  )
}
