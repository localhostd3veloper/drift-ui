import { cn } from "@/registry/default/lib/utils"
import {
  PasswordInput,
  PasswordStrength,
} from "@/registry/default/ui/password-input"

const SAMPLE_PASSWORD = "Copper-lantern9"

export function PasswordInputSpecimen({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <PasswordInput
        aria-label="Password"
        defaultValue={SAMPLE_PASSWORD}
        readOnly
      />
      <PasswordStrength value={SAMPLE_PASSWORD} />
    </div>
  )
}
