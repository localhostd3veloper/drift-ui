import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/default/lib/utils"

function Timeline({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="timeline"
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
}

function TimelineItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="timeline-item"
      className={cn(
        "group/timeline-item relative grid grid-cols-[auto_1fr] gap-x-3 pb-6 last:pb-0",
        className
      )}
      {...props}
    />
  )
}

const timelineIndicatorVariants = cva(
  "relative z-10 mt-1.5 size-2.5 shrink-0 rounded-full border-2 border-background ring-1 ring-border",
  {
    variants: {
      variant: {
        default: "bg-muted-foreground",
        current: "bg-primary ring-4 ring-primary/40",
        success: "bg-emerald-500 ring-emerald-500/30",
        destructive: "bg-destructive ring-destructive/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TimelineIndicator({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof timelineIndicatorVariants>) {
  return (
    <span
      data-slot="timeline-indicator"
      aria-hidden
      className={cn(
        "col-start-1 row-span-full flex flex-col items-center",
        "after:absolute after:top-4 after:bottom-0 after:left-[4.5px] after:w-px after:bg-border group-last/timeline-item:after:hidden",
        className
      )}
      {...props}
    >
      <span className={cn(timelineIndicatorVariants({ variant }))} />
    </span>
  )
}

function TimelineContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-content"
      className={cn("col-start-2 flex min-w-0 flex-col gap-1", className)}
      {...props}
    />
  )
}

function TimelineHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-header"
      className={cn(
        "flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5",
        className
      )}
      {...props}
    />
  )
}

function TimelineTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="timeline-title"
      className={cn("text-sm leading-snug font-medium", className)}
      {...props}
    />
  )
}

function TimelineTime({ className, ...props }: React.ComponentProps<"time">) {
  return (
    <time
      data-slot="timeline-time"
      className={cn(
        "font-mono text-xs text-muted-foreground tabular-nums",
        className
      )}
      {...props}
    />
  )
}

function TimelineDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="timeline-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Timeline,
  TimelineItem,
  TimelineIndicator,
  TimelineContent,
  TimelineHeader,
  TimelineTitle,
  TimelineTime,
  TimelineDescription,
  timelineIndicatorVariants,
}
