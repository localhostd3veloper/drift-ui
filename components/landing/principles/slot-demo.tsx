"use client"

import { useState } from "react"

import { cn } from "@/registry/default/lib/utils"
import { Label } from "@/registry/default/ui/label"
import { TagsInput } from "@/registry/default/ui/tags-input"

const OVERRIDE_CSS = `[data-slot="tags-input-tag"] {
  border-radius: 9999px;
  color: var(--brand);
  background: color-mix(in oklab, var(--brand) 15%, transparent);
}`

export function SlotDemo() {
  const [isApplied, setIsApplied] = useState(true)

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl border bg-muted/40">
        <div className="flex items-center justify-between gap-3 border-b px-4 py-2">
          <span className="font-mono text-xs text-muted-foreground">
            globals.css
          </span>
          <button
            type="button"
            aria-pressed={isApplied}
            onClick={() => setIsApplied((applied) => !applied)}
            className="h-7 rounded-md border px-2.5 font-mono text-xs text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-[0.97] aria-pressed:text-foreground"
          >
            {isApplied ? "Remove rule" : "Apply rule"}
          </button>
        </div>
        <pre
          className={cn(
            "overflow-x-auto p-4 font-mono text-xs leading-relaxed transition-opacity sm:text-[13px]",
            !isApplied && "opacity-40"
          )}
        >
          <code>{OVERRIDE_CSS}</code>
        </pre>
      </div>
      <div
        className={cn(
          "grid gap-2 rounded-xl border bg-card p-4 text-card-foreground shadow-[0_24px_48px_-24px] shadow-black/10 dark:shadow-black/60",
          isApplied &&
            "**:data-[slot=tags-input-tag]:rounded-full **:data-[slot=tags-input-tag]:bg-brand/15 **:data-[slot=tags-input-tag]:text-brand"
        )}
      >
        <Label htmlFor="slot-demo-tags">Labels</Label>
        <TagsInput
          id="slot-demo-tags"
          defaultValue={["design", "frontend", "a11y"]}
          placeholder="Add label"
        />
      </div>
    </div>
  )
}
