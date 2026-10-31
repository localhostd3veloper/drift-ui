"use client"

import * as React from "react"
import { FileIcon, FolderIcon } from "lucide-react"

import { Button } from "@/registry/default/ui/button"
import { TreeView, type TreeNode } from "@/registry/default/ui/tree-view"

const ITEMS: TreeNode[] = [
  {
    id: "src",
    label: "src",
    icon: <FolderIcon />,
    children: [
      { id: "src/index", label: "index.ts", icon: <FileIcon /> },
      { id: "src/routes", label: "routes.ts", icon: <FileIcon /> },
    ],
  },
  {
    id: "tests",
    label: "tests",
    icon: <FolderIcon />,
    children: [{ id: "tests/api", label: "api.test.ts", icon: <FileIcon /> }],
  },
]

export function TreeViewControlledPreview() {
  const [expanded, setExpanded] = React.useState(["src"])

  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded(["src", "tests"])}
        >
          Expand all
        </Button>
        <Button variant="outline" size="sm" onClick={() => setExpanded([])}>
          Collapse all
        </Button>
      </div>
      <TreeView
        aria-label="Repository"
        items={ITEMS}
        expanded={expanded}
        onExpandedChange={setExpanded}
      />
    </div>
  )
}
