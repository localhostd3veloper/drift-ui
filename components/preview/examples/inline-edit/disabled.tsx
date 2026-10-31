"use client"

import { InlineEdit } from "@/registry/default/ui/inline-edit"

export function InlineEditDisabledPreview() {
  return (
    <div className="w-full max-w-xs">
      <InlineEdit
        aria-label="Workspace owner"
        value="Noor Haddad"
        onSave={() => {}}
        disabled
      />
    </div>
  )
}
