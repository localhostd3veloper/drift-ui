import { cn } from "@/registry/default/lib/utils"
import { RADIUS_OPTIONS } from "@/lib/showcase-presets"

export function RadiusPicker({
  value,
  onValueChange,
  className,
}: {
  value: string
  onValueChange: (radius: string) => void
  className?: string
}) {
  return (
    <div
      role="group"
      aria-label="Radius"
      className={cn("grid grid-cols-5 gap-2", className)}
    >
      {RADIUS_OPTIONS.map((radius) => (
        <button
          key={radius}
          type="button"
          aria-pressed={radius === value}
          aria-label={`${radius} radius`}
          onClick={() => onValueChange(radius)}
          className="flex flex-col items-center gap-1.5 rounded-lg border px-1 pt-2.5 pb-1.5 text-[11px] text-muted-foreground tabular-nums transition-colors outline-none hover:border-foreground/25 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-pressed:border-foreground/60 aria-pressed:text-foreground"
        >
          <span
            aria-hidden
            style={{ borderTopLeftRadius: radius }}
            className="size-5 translate-x-1 border-t-2 border-l-2 border-current"
          />
          {radius.replace("rem", "")}
        </button>
      ))}
    </div>
  )
}
