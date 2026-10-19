import { cn } from "@/registry/default/lib/utils"

export function DocSection({
  id,
  title,
  children,
  className,
}: {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn("flex scroll-mt-32 flex-col gap-5", className)}
    >
      <h2 id={`${id}-heading`} className="text-2xl font-medium tracking-tight">
        <a
          href={`#${id}`}
          className="outline-none hover:underline hover:decoration-border hover:underline-offset-8 focus-visible:underline"
        >
          {title}
        </a>
      </h2>
      {children}
    </section>
  )
}
