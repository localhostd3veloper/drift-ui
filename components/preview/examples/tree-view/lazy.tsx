"use client"

import * as React from "react"
import { FileIcon, FolderIcon } from "lucide-react"

import { TreeView, type TreeNode } from "@/registry/default/ui/tree-view"

const SIMULATED_FETCH_MS = 900

export function TreeViewLazyPreview() {
  const [logs, setLogs] = React.useState<TreeNode[]>()

  function loadLogs(expanded: string[]) {
    if (!expanded.includes("logs") || logs) return

    setTimeout(() => {
      setLogs([
        { id: "logs/api", label: "api.log", icon: <FileIcon /> },
        { id: "logs/worker", label: "worker.log", icon: <FileIcon /> },
      ])
    }, SIMULATED_FETCH_MS)
  }

  return (
    <TreeView
      aria-label="Server files"
      items={[
        {
          id: "logs",
          label: "logs",
          icon: <FolderIcon />,
          isBranch: true,
          children: logs,
        },
      ]}
      onExpandedChange={loadLogs}
      className="w-full max-w-xs"
    />
  )
}
