"use client"

import * as React from "react"

import { TransferList } from "@/registry/default/ui/transfer-list"

const PERMISSIONS = [
  { id: "read", label: "Read Data", description: "View dashboard and reports" },
  { id: "write", label: "Write Data", description: "Create and edit records" },
  {
    id: "delete",
    label: "Delete Records",
    description: "Permanently delete rows",
  },
  { id: "export", label: "Export CSV", description: "Download data dumps" },
  {
    id: "billing",
    label: "Manage Billing",
    description: "Invoices and subscription",
  },
  {
    id: "admin",
    label: "Administrator",
    description: "Full workspace configuration",
    disabled: true,
  },
]

export function TransferListPreview() {
  const [assigned, setAssigned] = React.useState(["read", "write"])

  return (
    <div className="w-full max-w-2xl">
      <TransferList
        items={PERMISSIONS}
        value={assigned}
        onValueChange={setAssigned}
        titles={["Available Permissions", "Assigned Permissions"]}
        searchable
      />
    </div>
  )
}
