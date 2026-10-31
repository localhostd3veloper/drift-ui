import { Label } from "@/registry/default/ui/label"
import { PasswordInput } from "@/registry/default/ui/password-input"

export function PasswordInputSignInPreview() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="password-sign-in">Password</Label>
      <PasswordInput id="password-sign-in" autoComplete="current-password" />
    </div>
  )
}
