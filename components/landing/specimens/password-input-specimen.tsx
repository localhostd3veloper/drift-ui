import { cn } from "@/registry/default/lib/utils"
import { Input } from "@/registry/default/ui/input"
import { PasswordStrength } from "@/registry/default/ui/password-input"

const SAMPLE_PASSWORD = "Copper-lantern9"

export function PasswordInputSpecimen({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <Input
        aria-label="Password"
        value={"•".repeat(SAMPLE_PASSWORD.length)}
        readOnly
      />
      <PasswordStrength value={SAMPLE_PASSWORD} />
    </div>
  )
}
