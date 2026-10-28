"use client"

import { useState } from "react"
import { RotateCcwIcon } from "lucide-react"
import { motion } from "motion/react"
import { Tabs as TabsPrimitive } from "radix-ui"

import { CodeFrame } from "@/components/docs/code-frame"
import { TabsRail } from "@/components/docs/tabs-rail"
import { ThemeScopeControl } from "@/components/docs/theme-scope-control"
import type { HighlightedFile } from "@/lib/component-docs"

const TABS = [
  { value: "preview", label: "Preview" },
  { value: "code", label: "Code" },
]

export function PreviewTabs({
  preview,
  usage,
}: {
  preview: React.ReactNode
  usage: HighlightedFile
}) {
  const [tab, setTab] = useState("preview")
  const [resetCount, setResetCount] = useState(0)

  return (
    <TabsPrimitive.Root value={tab} onValueChange={setTab}>
      <div className="flex items-center justify-between gap-4">
        <TabsRail items={TABS} value={tab} label="Example" />
        {tab === "preview" && (
          <div className="flex items-center gap-1">
            <ThemeScopeControl />
            <button
              type="button"
              onClick={() => setResetCount((count) => count + 1)}
              className="flex h-8 items-center gap-2 rounded-md px-3 text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <motion.span
                animate={{ rotate: resetCount * -360 }}
                transition={{ type: "spring", stiffness: 180, damping: 18 }}
                className="flex"
              >
                <RotateCcwIcon className="size-3.5" />
              </motion.span>
              Reset
            </button>
          </div>
        )}
      </div>
      <TabsPrimitive.Content
        value="preview"
        forceMount
        className="mt-3 outline-none data-[state=inactive]:hidden"
      >
        <div
          data-theme-scope
          className="flex min-h-[26rem] items-center justify-center overflow-hidden rounded-[1.75rem] border bg-background bg-[radial-gradient(80%_70%_at_50%_0%,color-mix(in_oklab,var(--foreground)_5%,transparent),transparent)] px-4 py-10 font-sans text-foreground sm:px-10 md:py-16"
        >
          <div key={resetCount} className="w-full max-w-2xl">
            {preview}
          </div>
        </div>
      </TabsPrimitive.Content>
      <TabsPrimitive.Content value="code" className="mt-3 outline-none">
        <CodeFrame {...usage} collapsible />
      </TabsPrimitive.Content>
    </TabsPrimitive.Root>
  )
}
