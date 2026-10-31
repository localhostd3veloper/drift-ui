import { TransferList } from "@/registry/default/ui/transfer-list"

const SCOPES = [
  { id: "repo", label: "repo" },
  { id: "workflow", label: "workflow" },
  { id: "packages", label: "packages" },
]

export function TransferListNoSelectAllPreview() {
  return (
    <div className="w-full max-w-2xl">
      <TransferList
        items={SCOPES}
        defaultValue={["repo"]}
        titles={["Scopes", "Granted"]}
        showSelectAll={false}
      />
    </div>
  )
}
