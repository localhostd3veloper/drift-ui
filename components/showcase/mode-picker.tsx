"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { SegmentedControl } from "@/components/docs/segmented-control"
import { useHasHydrated } from "@/hooks/use-has-hydrated"

const MODE_ITEMS = [
  {
    value: "light",
    label: (
      <>
        <SunIcon className="size-3.5" />
        Light
      </>
    ),
  },
  {
    value: "dark",
    label: (
      <>
        <MoonIcon className="size-3.5" />
        Dark
      </>
    ),
  },
]

export function ModePicker({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const hasHydrated = useHasHydrated()

  return (
    <SegmentedControl<string>
      label="Mode"
      items={MODE_ITEMS}
      value={hasHydrated ? (resolvedTheme ?? "") : ""}
      onValueChange={setTheme}
      className={className}
    />
  )
}
