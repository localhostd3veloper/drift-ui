import { cn } from "@/registry/default/lib/utils"
import { NumberInput } from "@/registry/default/ui/number-input"

export function NumberInputSpecimen({ className }: { className?: string }) {
  return (
    <NumberInput
      aria-label="Replicas"
      defaultValue={3}
      min={1}
      max={12}
      className={cn("w-40 shrink-0", className)}
    />
  )
}
