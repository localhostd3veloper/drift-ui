"use client"

import * as React from "react"
import { ArchiveIcon, Trash2Icon } from "lucide-react"

import {
  BulkActionBar,
  BulkActionBarButton,
} from "@/registry/default/ui/bulk-action-bar"

const ROWS = [
  "Invoice totals round twice",
  "Retry webhook deliveries",
  "Dark mode chart contrast",
]

export function BulkActionDemo() {
  const [selectedRows, setSelectedRows] = React.useState(ROWS.slice(0, 2))
  const clearSelection = React.useCallback(() => setSelectedRows([]), [])

  function toggleRow(row: string) {
    setSelectedRows((current) =>
      current.includes(row)
        ? current.filter((selected) => selected !== row)
        : [...current, row]
    )
  }

  return (
    <div className="relative flex min-h-48 flex-col gap-2 pb-16">
      <ul className="divide-y rounded-md border text-xs">
        {ROWS.map((row) => (
          <li key={row}>
            <label className="flex items-center gap-2.5 px-3 py-2">
              <input
                type="checkbox"
                checked={selectedRows.includes(row)}
                onChange={() => toggleRow(row)}
                className="size-3.5 accent-primary"
              />
              {row}
            </label>
          </li>
        ))}
      </ul>
      <BulkActionBar
        placement="container"
        selectedCount={selectedRows.length}
        onClear={clearSelection}
        className="[&_[data-slot=button]]:h-7"
      >
        <BulkActionBarButton onClick={clearSelection}>
          <ArchiveIcon />
          Archive
        </BulkActionBarButton>
        <BulkActionBarButton
          onClick={clearSelection}
          className="text-destructive hover:text-destructive"
        >
          <Trash2Icon />
          Delete
        </BulkActionBarButton>
      </BulkActionBar>
    </div>
  )
}
