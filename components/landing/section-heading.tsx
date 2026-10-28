import { cn } from "@/registry/default/lib/utils"

export function SectionHeading({
  eyebrow,
  title,
  lead,
  className,
}: {
  eyebrow?: string
  title: string
  lead: string
  className?: string
}) {
  return (
    <div className={cn("flex reveal flex-col gap-6", className)}>
      {eyebrow && (
        <span className="font-mono text-xs tracking-widest text-brand uppercase">
          {eyebrow}
        </span>
      )}
      <h2 className="max-w-4xl font-display text-[clamp(2.5rem,5.4vw,4.75rem)] leading-[0.95] font-semibold tracking-[-0.04em] text-balance">
        {title}
      </h2>
      <p className="max-w-[56ch] text-lg leading-relaxed text-muted-foreground">
        {lead}
      </p>
    </div>
  )
}
