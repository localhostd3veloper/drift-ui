"use client"

import { VirtualList } from "@/registry/default/ui/virtual-list"

const CUSTOMERS = Array.from({ length: 5000 }, (_, index) => ({
  id: index,
  name: `Customer ${index + 1}`,
}))

export function VirtualListFocusableRowsPreview() {
  return (
    <VirtualList
      aria-label="Customers"
      items={CUSTOMERS}
      estimateSize={40}
      overscan={8}
      getItemKey={(customer) => customer.id}
      className="h-60 w-full max-w-md rounded-lg border"
    >
      {(customer) => (
        <div className="flex items-center justify-between px-3 py-2 text-sm">
          {customer.name}
          <button
            type="button"
            className="rounded-sm underline underline-offset-4 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            Open
          </button>
        </div>
      )}
    </VirtualList>
  )
}
