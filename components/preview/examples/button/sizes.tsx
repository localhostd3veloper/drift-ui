import { PlusIcon } from "lucide-react"

import { Button } from "@/registry/default/ui/button"

export function ButtonSizesPreview() {
  return (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Add">
        <PlusIcon />
      </Button>
    </div>
  )
}
