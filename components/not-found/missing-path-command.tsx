"use client"

import { usePathname } from "next/navigation"

import { cn } from "@/registry/default/lib/utils"

export function MissingPathCommand({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "w-full max-w-xl overflow-hidden rounded-xl border bg-card/60 font-mono text-xs backdrop-blur-sm sm:text-sm",
        className
      )}
    >
      <div className="flex items-center gap-1.5 border-b px-4 py-3">
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="size-2.5 rounded-full bg-foreground/15" />
      </div>
      <div className="flex flex-col gap-2 px-4 py-4">
        <p className="truncate">
          <span className="text-muted-foreground">$ </span>
          curl -I {pathname}
        </p>
        <p className="text-destructive">HTTP/1.1 404 Not Found</p>
        <p className="text-muted-foreground">
          No route or registry item matches this path.
        </p>
      </div>
    </div>
  )
}
