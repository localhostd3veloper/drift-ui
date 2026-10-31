import { Input } from "@/registry/default/ui/input"
import { Label } from "@/registry/default/ui/label"

export function InputFilePreview() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="input-file">Attachment</Label>
      <Input id="input-file" type="file" />
    </div>
  )
}
