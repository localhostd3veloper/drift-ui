"use client"

import { Label } from "@/registry/default/ui/label"
import { TagsInput } from "@/registry/default/ui/tags-input"

export function TagsInputValidatePreview() {
  return (
    <div className="grid w-full max-w-md gap-2">
      <Label htmlFor="tags-validate">Invite by email</Label>
      <TagsInput
        id="tags-validate"
        defaultValue={["noor@example.com"]}
        placeholder="name@company.com"
        validate={(tag) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tag)}
      />
    </div>
  )
}
