import { Button } from "@/registry/default/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover"

export function PopoverPlacementPreview() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open above</Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" className="w-56 text-sm">
        Anchored to the start of the trigger, above it.
      </PopoverContent>
    </Popover>
  )
}
