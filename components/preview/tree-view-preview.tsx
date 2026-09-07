import { FileIcon, FolderIcon } from "lucide-react"

import { TreeView, type TreeNode } from "@/registry/default/ui/tree-view"

const PROJECT_TREE: TreeNode[] = [
  {
    id: "app",
    label: "app",
    icon: <FolderIcon />,
    children: [
      {
        id: "app/marketing",
        label: "(marketing)",
        icon: <FolderIcon />,
        children: [
          { id: "app/marketing/page", label: "page.tsx", icon: <FileIcon /> },
        ],
      },
      { id: "app/layout", label: "layout.tsx", icon: <FileIcon /> },
      { id: "app/globals", label: "globals.css", icon: <FileIcon /> },
    ],
  },
  {
    id: "registry",
    label: "registry",
    icon: <FolderIcon />,
    children: [
      {
        id: "registry/tags-input",
        label: "tags-input.tsx",
        icon: <FileIcon />,
      },
      { id: "registry/tree-view", label: "tree-view.tsx", icon: <FileIcon /> },
    ],
  },
  { id: "archive", label: "archive", icon: <FolderIcon />, isBranch: true },
  { id: "package", label: "package.json", icon: <FileIcon /> },
]

export function TreeViewPreview() {
  return (
    <>
      <TreeView
        aria-label="Project files"
        items={PROJECT_TREE}
        defaultExpanded={["app", "archive"]}
        defaultSelected="app/layout"
        className="w-full max-w-xs"
      />
    </>
  )
}
