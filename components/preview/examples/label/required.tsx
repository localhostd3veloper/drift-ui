import { Input } from "@/registry/default/ui/input"
import { Label } from "@/registry/default/ui/label"

export function LabelRequiredPreview() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="label-required">
        Work email
        <span aria-hidden className="text-destructive">
          *
        </span>
      </Label>
      <Input id="label-required" type="email" required />
    </div>
  )
}
