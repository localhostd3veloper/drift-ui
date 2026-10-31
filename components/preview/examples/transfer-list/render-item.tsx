"use client"

import { Badge } from "@/registry/default/ui/badge"
import { TransferList } from "@/registry/default/ui/transfer-list"

const MEMBERS = [
  { id: "noor", label: "Noor Haddad", role: "Admin" },
  { id: "kofi", label: "Kofi Mensah", role: "Editor" },
  { id: "ilse", label: "Ilse Marchetti", role: "Viewer" },
]

export function TransferListRenderItemPreview() {
  return (
    <div className="w-full max-w-2xl">
      <TransferList
        items={MEMBERS}
        defaultValue={["noor"]}
        titles={["Workspace", "This project"]}
        renderItem={(member) => (
          <span className="flex items-center gap-2">
            {member.label}
            <Badge variant="secondary">{member.role}</Badge>
          </span>
        )}
      />
    </div>
  )
}
