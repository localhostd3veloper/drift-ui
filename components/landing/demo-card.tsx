import { cn } from "@/registry/default/lib/utils"

export function DemoCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card/80 p-4 text-card-foreground shadow-[0_24px_48px_-24px] shadow-black/10 dark:shadow-black/60",
        className
      )}
    >
      {children}
    </div>
  )
}
