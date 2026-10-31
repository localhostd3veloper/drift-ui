import { ClockIcon, ShieldCheckIcon } from "lucide-react"

import { Badge } from "@/registry/default/ui/badge"

export function BadgeWithIconPreview() {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary">
        <ShieldCheckIcon /> Verified
      </Badge>
      <Badge variant="outline">
        <ClockIcon /> Pending
      </Badge>
    </div>
  )
}
