import { InfoIcon } from "lucide-react"

import { Button } from "@/registry/default/ui/button"
import { Label } from "@/registry/default/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover"

export function PopoverHelpPreview() {
  return (
    <div className="flex items-center gap-1">
      <Label>Webhook secret</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="About webhook secrets"
          >
            <InfoIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 text-sm">
          Signs each request so your server can check it came from us.
        </PopoverContent>
      </Popover>
    </div>
  )
}
