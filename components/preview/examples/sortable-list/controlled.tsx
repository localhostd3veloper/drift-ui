"use client"

import * as React from "react"

import {
  SortableDragHandle,
  SortableItem,
  SortableList,
} from "@/registry/default/ui/sortable-list"

export function SortableListControlledPreview() {
  const [widgets, setWidgets] = React.useState(["Revenue", "Signups", "Churn"])

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <SortableList
        aria-label="Dashboard widgets"
        value={widgets}
        onValueChange={setWidgets}
      >
        {(widget) => (
          <SortableItem key={widget} value={widget} className="gap-2 text-sm">
            <SortableDragHandle />
            {widget}
          </SortableItem>
        )}
      </SortableList>
      <p className="font-mono text-xs text-muted-foreground">
        {widgets.join(" > ")}
      </p>
    </div>
  )
}
