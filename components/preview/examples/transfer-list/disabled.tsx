import { TransferList } from "@/registry/default/ui/transfer-list"

const ROLES = [
  { id: "billing", label: "Billing" },
  { id: "support", label: "Support" },
  { id: "admin", label: "Admin" },
]

export function TransferListDisabledPreview() {
  return (
    <div className="w-full max-w-2xl">
      <TransferList items={ROLES} defaultValue={["support"]} disabled />
    </div>
  )
}
