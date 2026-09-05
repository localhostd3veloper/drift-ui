import { Label } from "@/registry/default/ui/label"
import { TagsInput } from "@/registry/default/ui/tags-input"

export function TagsInputPreview() {
  return (
    <>
      <div className="grid w-full max-w-md gap-2">
        <Label htmlFor="preview-environments">Environments</Label>
        <TagsInput
          id="preview-environments"
          defaultValue={["billing", "eu-west-1"]}
          placeholder="Add environment"
          max={6}
        />
        <p className="text-xs text-muted-foreground">
          Enter or comma to add, Backspace twice to remove, paste a comma list.
        </p>
      </div>
    </>
  )
}
