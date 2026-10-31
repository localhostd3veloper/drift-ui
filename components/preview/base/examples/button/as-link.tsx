import Link from "next/link"

import { Button } from "@/registry/base/ui/button"

export function ButtonAsLinkPreview() {
  return (
    <Button
      nativeButton={false}
      render={<Link href="/components" />}
      variant="outline"
    >
      Browse components
    </Button>
  )
}
