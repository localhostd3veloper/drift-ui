import { Input } from "@/registry/default/ui/input"
import { Label } from "@/registry/base/ui/label"

export function LabelHintPreview() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="label-hint">Subdomain</Label>
      <Input id="label-hint" aria-describedby="label-hint-text" />
      <p id="label-hint-text" className="text-xs text-muted-foreground">
        Lowercase letters and numbers only.
      </p>
    </div>
  )
}
