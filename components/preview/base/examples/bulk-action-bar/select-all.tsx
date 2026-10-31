"use client"

import * as React from "react"
import { ArchiveIcon } from "lucide-react"

import {
  BulkActionBar,
  BulkActionBarButton,
} from "@/registry/base/ui/bulk-action-bar"

const USERS = ["Noor Haddad", "Kofi Mensah", "Ilse Marchetti"]

export function BulkActionBarSelectAllPreview() {
  const [selected, setSelected] = React.useState<string[]>([USERS[0]])
  const clearSelection = React.useCallback(() => setSelected([]), [])
  const isAllSelected = selected.length === USERS.length

  return (
    <div className="relative min-h-60 w-full max-w-sm pb-16">
      <label className="flex items-center gap-3 border-b px-3 py-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={isAllSelected}
          ref={(input) => {
            if (input) {
              input.indeterminate = selected.length > 0 && !isAllSelected
            }
          }}
          onChange={() => setSelected(isAllSelected ? [] : USERS)}
          className="size-4 accent-primary"
        />
        Select all
      </label>
      <ul className="text-sm">
        {USERS.map((user) => (
          <li key={user}>
            <label className="flex items-center gap-3 px-3 py-2">
              <input
                type="checkbox"
                checked={selected.includes(user)}
                onChange={() =>
                  setSelected((current) =>
                    current.includes(user)
                      ? current.filter((item) => item !== user)
                      : [...current, user]
                  )
                }
                className="size-4 accent-primary"
              />
              {user}
            </label>
          </li>
        ))}
      </ul>
      <BulkActionBar
        placement="container"
        selectedCount={selected.length}
        onClear={clearSelection}
      >
        <BulkActionBarButton onClick={clearSelection}>
          <ArchiveIcon />
          Archive
        </BulkActionBarButton>
      </BulkActionBar>
    </div>
  )
}
