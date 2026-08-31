import { Input } from "@/registry/default/ui/input"
import { Label } from "@/registry/default/ui/label"

export function InputPreview() {
  return (
    <div className="grid w-full max-w-sm gap-5">
      <div className="grid gap-2">
        <Label htmlFor="input-workspace">Workspace</Label>
        <Input id="input-workspace" placeholder="ledgerline" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="input-webhook">Webhook URL</Label>
        <Input
          id="input-webhook"
          type="url"
          defaultValue="hooks.ledgerline"
          aria-invalid
          aria-describedby="input-webhook-error"
        />
        <p id="input-webhook-error" className="text-xs text-destructive">
          Enter a full URL, starting with https://
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="input-region">Region</Label>
        <Input id="input-region" defaultValue="eu-west-1" disabled />
      </div>
    </div>
  )
}
