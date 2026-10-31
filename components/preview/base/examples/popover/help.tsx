import { InfoIcon } from "lucide-react"

import { Button } from "@/registry/base/ui/button"
import { Label } from "@/registry/base/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/base/ui/popover"

export function PopoverHelpPreview() {
  return (
    <div className="flex items-center gap-1">
      <Label>Webhook secret</Label>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label="About webhook secrets"
            />
          }
        >
          <InfoIcon />
        </PopoverTrigger>
        <PopoverContent className="w-64 text-sm">
          Signs each request so your server can check it came from us.
        </PopoverContent>
      </Popover>
    </div>
  )
}
