import { cn } from "@/registry/default/lib/utils"

export function SectionHeading({
  eyebrow,
  title,
  lead,
  className,
}: {
  eyebrow?: string
  title: [string, string]
  lead: string
  className?: string
}) {
  return (
    <div
      className={cn("grid reveal gap-8 lg:grid-cols-2 lg:gap-16", className)}
    >
      <div className="flex flex-col gap-5">
        {eyebrow && (
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            {eyebrow}
          </span>
        )}
        <h2 className="text-4xl leading-none font-medium tracking-tight md:text-5xl">
          {title[0]}
          <br />
          {title[1]}
        </h2>
      </div>
      <p className="max-w-[40ch] self-end text-xl leading-snug text-muted-foreground md:text-2xl">
        {lead}
      </p>
    </div>
  )
}
