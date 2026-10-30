"use client"

import { VirtualList } from "@/registry/default/ui/virtual-list"

const STAGES = ["clone", "install", "build", "test", "upload"]

const DEPLOY_LOG = Array.from({ length: 10000 }, (_, index) => ({
  id: index,
  stage: STAGES[index % STAGES.length],
  message:
    index % 7 === 0
      ? `Step ${index} wrote a longer status line that wraps onto a second row, so this entry measures taller than its neighbours`
      : `Step ${index} finished`,
}))

export function VirtualListPreview() {
  return (
    <VirtualList
      aria-label="Deploy log"
      items={DEPLOY_LOG}
      estimateSize={32}
      getItemKey={(line) => line.id}
      className="h-80 w-full max-w-lg rounded-lg border"
    >
      {(line, index) => (
        <div className="flex gap-3 px-3 py-1.5 font-mono text-xs">
          <span className="w-10 shrink-0 text-right text-muted-foreground">
            {index + 1}
          </span>
          <span className="w-14 shrink-0 text-muted-foreground">
            {line.stage}
          </span>
          <span className="min-w-0">{line.message}</span>
        </div>
      )}
    </VirtualList>
  )
}
