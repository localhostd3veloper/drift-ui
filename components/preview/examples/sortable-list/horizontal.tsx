"use client"

import { SortableItem, SortableList } from "@/registry/default/ui/sortable-list"

const STAGES = ["Lint", "Test", "Build", "Deploy"]

export function SortableListHorizontalPreview() {
  return (
    <SortableList
      aria-label="Pipeline stages"
      orientation="horizontal"
      defaultValue={STAGES}
    >
      {(stage) => (
        <SortableItem key={stage} value={stage} className="text-sm font-medium">
          {stage}
        </SortableItem>
      )}
    </SortableList>
  )
}
