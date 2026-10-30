"use client"

import { Badge } from "@/registry/default/ui/badge"
import {
  SortableDragHandle,
  SortableItem,
  SortableList,
} from "@/registry/default/ui/sortable-list"

const INITIAL_TASKS = [
  { id: "1", title: "Quarterly roadmap review", tag: "Strategy" },
  { id: "2", title: "Migrate auth to passkeys", tag: "Security" },
  { id: "3", title: "Redesign onboarding flow", tag: "Product" },
  { id: "4", title: "Optimize cold start latency", tag: "Infra" },
  { id: "5", title: "Write the incident runbook", tag: "Ops" },
]

export function SortableListPreview() {
  return (
    <div className="w-full max-w-md">
      <SortableList
        aria-label="Task priority"
        defaultValue={INITIAL_TASKS}
        getKey={(task) => task.id}
      >
        {(task, index) => (
          <SortableItem key={task.id} value={task.id} className="gap-2 py-2.5">
            <SortableDragHandle />
            <span className="w-4 shrink-0 text-center font-mono text-xs text-muted-foreground tabular-nums">
              {index + 1}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {task.title}
            </span>
            <Badge variant="secondary" className="shrink-0 text-xs">
              {task.tag}
            </Badge>
          </SortableItem>
        )}
      </SortableList>
    </div>
  )
}
