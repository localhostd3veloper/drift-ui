"use client"

import * as React from "react"
import { Trash2Icon } from "lucide-react"

import {
  BulkActionBar,
  BulkActionBarButton,
} from "@/registry/default/ui/bulk-action-bar"

const INVOICES = ["INV-0041", "INV-0042", "INV-0043"]

export function BulkActionBarViewportPreview() {
  const [selected, setSelected] = React.useState<string[]>([])
  const clearSelection = React.useCallback(() => setSelected([]), [])

  function toggleInvoice(invoice: string) {
    setSelected((current) =>
      current.includes(invoice)
        ? current.filter((item) => item !== invoice)
        : [...current, invoice]
    )
  }

  return (
    <>
      <ul className="w-full max-w-sm divide-y rounded-md border text-sm">
        {INVOICES.map((invoice) => (
          <li key={invoice}>
            <label className="flex items-center gap-3 px-3 py-2">
              <input
                type="checkbox"
                checked={selected.includes(invoice)}
                onChange={() => toggleInvoice(invoice)}
                className="size-4 accent-primary"
              />
              {invoice}
            </label>
          </li>
        ))}
      </ul>
      <BulkActionBar selectedCount={selected.length} onClear={clearSelection}>
        <BulkActionBarButton onClick={clearSelection}>
          <Trash2Icon />
          Delete
        </BulkActionBarButton>
      </BulkActionBar>
    </>
  )
}
