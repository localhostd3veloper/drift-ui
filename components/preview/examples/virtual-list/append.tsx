"use client"

import * as React from "react"

import { Button } from "@/registry/default/ui/button"
import { VirtualList } from "@/registry/default/ui/virtual-list"

function createEvents(start: number, count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: start + index,
    message: `Event ${start + index} received`,
  }))
}

export function VirtualListAppendPreview() {
  const [events, setEvents] = React.useState(() => createEvents(0, 50))

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <VirtualList
        aria-label="Event stream"
        items={events}
        estimateSize={32}
        getItemKey={(event) => event.id}
        className="h-52 rounded-lg border"
      >
        {(event) => <p className="px-3 py-1.5 text-sm">{event.message}</p>}
      </VirtualList>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          setEvents((current) => [
            ...current,
            ...createEvents(current.length, 1000),
          ])
        }
      >
        Add 1,000 events, {events.length} so far
      </Button>
    </div>
  )
}
