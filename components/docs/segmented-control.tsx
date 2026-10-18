"use client"

import { useId } from "react"
import { LayoutGroup } from "motion/react"
import { ToggleGroup } from "radix-ui"

import { cn } from "@/registry/default/lib/utils"
import { ActivePill } from "@/components/docs/active-pill"

export function SegmentedControl<Value extends string>({
  items,
  value,
  onValueChange,
  label,
  className,
}: {
  items: { value: Value; label: React.ReactNode }[]
  value: Value
  onValueChange: (value: Value) => void
  label: string
  className?: string
}) {
  const groupId = useId()

  function handleValueChange(next: string) {
    if (!next) return
    onValueChange(next as Value)
  }

  return (
    <LayoutGroup id={groupId}>
      <ToggleGroup.Root
        type="single"
        value={value}
        onValueChange={handleValueChange}
        aria-label={label}
        className={cn("flex min-w-0 items-center gap-1", className)}
      >
        {items.map((item) => (
          <ToggleGroup.Item
            key={item.value}
            value={item.value}
            className="relative isolate flex h-8 shrink-0 items-center gap-1.5 rounded-md px-3 text-sm whitespace-nowrap text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=on]:text-foreground"
          >
            {item.value === value && <ActivePill layoutId="segment" />}
            {item.label}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </LayoutGroup>
  )
}
