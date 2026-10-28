import { Input } from "@/registry/default/ui/input"
import { Label } from "@/registry/base/ui/label"

export function LabelPreview() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="grid gap-2">
        <Label htmlFor="label-display-name">Display name</Label>
        <Input id="label-display-name" defaultValue="Noor Haddad" />
      </div>
      <div className="flex items-center gap-3">
        <input
          id="label-deploy-alerts"
          type="checkbox"
          defaultChecked
          className="size-4 accent-primary"
        />
        <Label htmlFor="label-deploy-alerts">
          Email me when a deploy fails
        </Label>
      </div>
    </div>
  )
}
