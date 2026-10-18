"use client"

import { useId } from "react"
import { LayoutGroup } from "motion/react"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/registry/default/lib/utils"
import { ActivePill } from "@/components/docs/active-pill"

export function TabsRail({
  items,
  value,
  label,
  triggerClassName,
  className,
}: {
  items: { value: string; label: string }[]
  value: string
  label: string
  triggerClassName?: string
  className?: string
}) {
  const groupId = useId()

  return (
    <LayoutGroup id={groupId}>
      <TabsPrimitive.List
        aria-label={label}
        className={cn("flex min-w-0 items-center gap-1", className)}
      >
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            className={cn(
              "relative isolate flex h-8 shrink-0 items-center rounded-md px-3 text-sm whitespace-nowrap text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=active]:text-foreground",
              triggerClassName
            )}
          >
            {item.value === value && <ActivePill layoutId="tab" />}
            {item.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
    </LayoutGroup>
  )
}
