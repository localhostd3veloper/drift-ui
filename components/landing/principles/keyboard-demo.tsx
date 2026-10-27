import { FileIcon, FolderIcon } from "lucide-react"

import { TreeView, type TreeNode } from "@/registry/default/ui/tree-view"

const TREE: TreeNode[] = [
  {
    id: "app",
    label: "app",
    icon: <FolderIcon />,
    children: [
      {
        id: "app/settings",
        label: "settings",
        icon: <FolderIcon />,
        children: [
          { id: "app/settings/page", label: "page.tsx", icon: <FileIcon /> },
          {
            id: "app/settings/billing",
            label: "billing.tsx",
            icon: <FileIcon />,
          },
        ],
      },
      { id: "app/layout", label: "layout.tsx", icon: <FileIcon /> },
    ],
  },
  {
    id: "components",
    label: "components",
    icon: <FolderIcon />,
    children: [
      {
        id: "components/ui",
        label: "ui",
        icon: <FolderIcon />,
        isBranch: true,
      },
    ],
  },
  { id: "package", label: "package.json", icon: <FileIcon /> },
]

const KEYS = [
  { keys: ["↑", "↓"], action: "move" },
  { keys: ["→"], action: "expand" },
  { keys: ["←"], action: "collapse" },
  { keys: ["a-z"], action: "jump" },
]

export function KeyboardDemo() {
  return (
    <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-start">
      <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-[0_24px_48px_-24px] shadow-black/10 dark:shadow-black/60">
        <TreeView
          aria-label="Project files"
          items={TREE}
          defaultExpanded={["app", "app/settings"]}
          defaultSelected="app/settings/billing"
        />
      </div>
      <ul className="flex flex-wrap gap-x-5 gap-y-3 sm:flex-col">
        {KEYS.map((entry) => (
          <li
            key={entry.action}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            {entry.keys.map((key) => (
              <kbd
                key={key}
                className="flex h-6 min-w-6 items-center justify-center rounded-md border bg-muted px-1.5 font-mono text-xs text-foreground shadow-[inset_0_-1px_0] shadow-border"
              >
                {key}
              </kbd>
            ))}
            {entry.action}
          </li>
        ))}
      </ul>
    </div>
  )
}
