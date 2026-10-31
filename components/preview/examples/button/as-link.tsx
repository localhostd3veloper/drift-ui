import Link from "next/link"

import { Button } from "@/registry/default/ui/button"

export function ButtonAsLinkPreview() {
  return (
    <Button asChild variant="outline">
      <Link href="/components">Browse components</Link>
    </Button>
  )
}
