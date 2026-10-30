"use client"

import { Badge } from "@/registry/default/ui/badge"
import {
  SortableDragHandle,
  SortableItem,
  SortableList,
} from "@/registry/default/ui/sortable-list"

const INITIAL_TASKS = [
  {
    id: "1",
    title: "Quarterly roadmap review",
    tag: "Strategy",
    priority: "High",
  },
  {
    id: "2",
    title: "Migrate auth to passkeys",
    tag: "Security",
    priority: "High",
  },
  {
    id: "3",
    title: "Redesign onboarding flow",
    tag: "Product",
    priority: "Medium",
  },
  {
    id: "4",
    title: "Optimize cold start latency",
    tag: "Infra",
    priority: "Low",
  },
]

export function SortableListPreview() {
  return (
    <div className="w-full max-w-md">
      <SortableList defaultValue={INITIAL_TASKS} getKey={(task) => task.id}>
        {(task) => (
          <SortableItem
            key={task.id}
            value={task.id}
            className="justify-between"
          >
            <div className="flex min-w-0 items-center gap-3">
              <SortableDragHandle />
              <span className="truncate text-sm font-medium">{task.title}</span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {task.tag}
              </Badge>
            </div>
          </SortableItem>
        )}
      </SortableList>
    </div>
  )
}
