import {
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  GitBranchIcon,
} from "lucide-react"

import { Badge } from "@/registry/default/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"
import { TreeView, type TreeNode } from "@/registry/default/ui/tree-view"

const FILES: TreeNode[] = [
  {
    id: "src",
    label: "src",
    icon: <FolderIcon />,
    children: [
      {
        id: "src/routes",
        label: "routes",
        icon: <FolderIcon />,
        children: [
          {
            id: "src/routes/invoices",
            label: "invoices.ts",
            icon: <FileCodeIcon />,
          },
          {
            id: "src/routes/webhooks",
            label: "webhooks.ts",
            icon: <FileCodeIcon />,
          },
        ],
      },
      { id: "src/server", label: "server.ts", icon: <FileCodeIcon /> },
      { id: "src/env", label: "env.ts", icon: <FileCodeIcon /> },
    ],
  },
  {
    id: "migrations",
    label: "migrations",
    icon: <FolderIcon />,
    children: [
      {
        id: "migrations/0012",
        label: "0012_add_tax_rates.sql",
        icon: <FileIcon />,
      },
    ],
  },
  { id: "readme", label: "README.md", icon: <FileTextIcon /> },
  { id: "package", label: "package.json", icon: <FileIcon /> },
]

export function ProjectFilesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Files</CardTitle>
        <CardDescription>ledgerline/api</CardDescription>
        <CardAction>
          <Badge variant="outline" className="font-mono">
            <GitBranchIcon />
            main
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <TreeView
          aria-label="Repository files"
          items={FILES}
          defaultExpanded={["src", "src/routes"]}
          defaultSelected="src/routes/invoices"
          className="rounded-md border p-1"
        />
      </CardContent>
      <CardFooter className="gap-2 text-xs text-muted-foreground">
        <span className="font-mono text-foreground">a41c9e2</span>
        <span className="truncate">Round tax per line item</span>
        <span className="ml-auto shrink-0">2h ago</span>
      </CardFooter>
    </Card>
  )
}
