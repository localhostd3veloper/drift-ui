import { FileIcon } from "lucide-react"

import { TreeView, type TreeNode } from "@/registry/default/ui/tree-view"

const ITEMS: TreeNode[] = [
  { id: "readme", label: "README.md", icon: <FileIcon /> },
  {
    id: "secrets",
    label: ".env, no access",
    icon: <FileIcon />,
    disabled: true,
  },
  { id: "package", label: "package.json", icon: <FileIcon /> },
]

export function TreeViewDisabledPreview() {
  return (
    <TreeView
      aria-label="Project root"
      items={ITEMS}
      defaultSelected="readme"
      className="w-full max-w-xs"
    />
  )
}
