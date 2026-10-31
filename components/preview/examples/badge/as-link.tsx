import Link from "next/link"

import { Badge } from "@/registry/default/ui/badge"

export function BadgeAsLinkPreview() {
  return (
    <Badge asChild variant="outline">
      <Link href="/components/badge">View the changelog</Link>
    </Badge>
  )
}
