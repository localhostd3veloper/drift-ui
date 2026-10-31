import { Button } from "@/registry/base/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/base/ui/popover"

export function PopoverPlacementPreview() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        Open above
      </PopoverTrigger>
      <PopoverContent side="top" align="start" className="w-56 text-sm">
        Anchored to the start of the trigger, above it.
      </PopoverContent>
    </Popover>
  )
}
