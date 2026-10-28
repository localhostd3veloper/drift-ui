import { CheckIcon } from "lucide-react"

import { Badge } from "@/registry/base/ui/badge"

export function BadgePreview() {
  return (
    <>
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="secondary">
        <CheckIcon /> Verified
      </Badge>
    </>
  )
}
