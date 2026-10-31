import { SearchIcon } from "lucide-react"

import { Input } from "@/registry/default/ui/input"

export function InputWithIconPreview() {
  return (
    <div className="relative w-full max-w-sm">
      <SearchIcon className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
      <Input aria-label="Search" placeholder="Search" className="pl-8" />
    </div>
  )
}
