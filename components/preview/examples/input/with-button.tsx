import { Button } from "@/registry/default/ui/button"
import { Input } from "@/registry/default/ui/input"

export function InputWithButtonPreview() {
  return (
    <div className="flex w-full max-w-sm items-center gap-2">
      <Input aria-label="Email" type="email" placeholder="you@company.com" />
      <Button>Subscribe</Button>
    </div>
  )
}
