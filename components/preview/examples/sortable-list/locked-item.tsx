"use client"

import {
  SortableDragHandle,
  SortableItem,
  SortableList,
} from "@/registry/default/ui/sortable-list"

const COLUMNS = [
  { id: "name", label: "Name, always first", isLocked: true },
  { id: "status", label: "Status", isLocked: false },
  { id: "owner", label: "Owner", isLocked: false },
]

export function SortableListLockedItemPreview() {
  return (
    <div className="w-full max-w-sm">
      <SortableList
        aria-label="Table columns"
        defaultValue={COLUMNS}
        getKey={(column) => column.id}
        getItemLabel={(column) => column.label}
      >
        {(column) => (
          <SortableItem
            key={column.id}
            value={column.id}
            disabled={column.isLocked}
            className="gap-2 text-sm"
          >
            <SortableDragHandle />
            {column.label}
          </SortableItem>
        )}
      </SortableList>
    </div>
  )
}
