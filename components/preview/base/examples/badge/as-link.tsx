import Link from "next/link"

import { Badge } from "@/registry/base/ui/badge"

export function BadgeAsLinkPreview() {
  return (
    <Badge render={<Link href="/components/badge" />} variant="outline">
      View the changelog
    </Badge>
  )
}
