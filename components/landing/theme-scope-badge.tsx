"use client"

import Link from "next/link"
import { XIcon } from "lucide-react"

import { cn } from "@/registry/default/lib/utils"
import { useShowcaseTheme } from "@/hooks/use-showcase-theme"
import { findActivePreset } from "@/lib/showcase-presets"
import { isEmptyTheme } from "@/lib/theme-css"

export function ThemeScopeBadge({ className }: { className?: string }) {
  const { theme, resetTheme } = useShowcaseTheme()
  if (isEmptyTheme(theme)) return null

  return (
    <div
      className={cn(
        "flex h-8 items-center rounded-full border bg-background text-xs",
        className
      )}
    >
      <Link
        href="/themes"
        className="flex h-full items-center gap-2 rounded-l-full pr-1.5 pl-2.5 text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <span
          data-theme-scope
          className="size-2.5 rounded-full bg-primary ring-1 ring-border"
        />
        {findActivePreset(theme)?.label ?? "Your theme"}
      </Link>
      <button
        type="button"
        aria-label="Stop previewing in your theme"
        onClick={resetTheme}
        className="flex size-8 items-center justify-center rounded-r-full text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <XIcon className="size-3.5" />
      </button>
    </div>
  )
}
