import { FileIcon } from "lucide-react"

import { cn } from "@/registry/default/lib/utils"
import { TreeView, type TreeNode } from "@/registry/default/ui/tree-view"

const PROJECT_TREE: TreeNode[] = [
  {
    id: "app",
    label: "app",
    children: [
      {
        id: "app/marketing",
        label: "(marketing)",
        isBranch: true,
        children: [],
      },
      {
        id: "app/components",
        label: "components",
        children: [
          { id: "app/components/page", label: "page.tsx", icon: <FileIcon /> },
          {
            id: "app/components/layout",
            label: "layout.tsx",
            icon: <FileIcon />,
          },
        ],
      },
      { id: "app/globals", label: "globals.css", icon: <FileIcon /> },
    ],
  },
  { id: "registry", label: "registry.json", icon: <FileIcon /> },
]

export function TreeViewSpecimen({ className }: { className?: string }) {
  return (
    <TreeView
      aria-label="Project files"
      items={PROJECT_TREE}
      defaultExpanded={["app", "app/components"]}
      defaultSelected="app/components/layout"
      className={cn("w-full font-mono text-xs", className)}
    />
  )
}
