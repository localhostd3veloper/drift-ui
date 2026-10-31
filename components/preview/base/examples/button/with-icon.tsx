import { DownloadIcon, SendIcon } from "lucide-react"

import { Button } from "@/registry/base/ui/button"

export function ButtonWithIconPreview() {
  return (
    <div className="flex items-center gap-3">
      <Button>
        <SendIcon /> Send invite
      </Button>
      <Button variant="outline">
        Export <DownloadIcon />
      </Button>
    </div>
  )
}
