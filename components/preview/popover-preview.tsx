import { Button } from "@/registry/default/ui/button"
import { Input } from "@/registry/default/ui/input"
import { Label } from "@/registry/default/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover"

export function PopoverPreview() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Export size</Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="grid gap-4">
          <div className="grid gap-1">
            <p className="text-sm font-medium">Export size</p>
            <p className="text-xs text-muted-foreground">
              Pixels, applied to every frame in the batch.
            </p>
          </div>
          <div className="grid grid-cols-[4.5rem_1fr] items-center gap-3">
            <Label htmlFor="popover-width">Width</Label>
            <Input id="popover-width" defaultValue="1200" className="h-8" />
            <Label htmlFor="popover-height">Height</Label>
            <Input id="popover-height" defaultValue="630" className="h-8" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
