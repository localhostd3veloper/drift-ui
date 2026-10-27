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
    <div className={cn("flex reveal flex-col gap-5", className)}>
      {eyebrow && (
        <span className="font-mono text-xs tracking-widest text-brand uppercase">
          {eyebrow}
        </span>
      )}
      <h2 className="max-w-3xl text-4xl leading-[1.05] font-medium tracking-tighter text-balance md:text-5xl">
        {title}
      </h2>
      <p className="max-w-[60ch] text-base leading-relaxed text-muted-foreground md:text-lg">
        {lead}
      </p>
    </div>
  )
}
