import { Label } from "@/registry/default/ui/label"
import { TagsInput } from "@/registry/default/ui/tags-input"

export function TagsInputAddOnBlurPreview() {
  return (
    <div className="grid w-full max-w-md gap-2">
      <Label htmlFor="tags-blur">Labels</Label>
      <TagsInput id="tags-blur" placeholder="Add a label" addOnBlur />
    </div>
  )
}
