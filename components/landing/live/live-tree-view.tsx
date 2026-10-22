"use client"

import { useId } from "react"
import { ChevronRightIcon, FileIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/registry/default/lib/utils"
import { DEMO_SPRING } from "@/components/landing/live/demo-spring"
import { useDemoFrame } from "@/components/landing/use-demo-frame"

const TREE = [
  { path: "app", depth: 0, isFolder: true },
  { path: "app/(marketing)", depth: 1, isFolder: true },
  { path: "app/components", depth: 1, isFolder: true },
  { path: "app/components/button.tsx", depth: 2, isFolder: false },
  { path: "app/components/dialog.tsx", depth: 2, isFolder: false },
  { path: "app/layout.tsx", depth: 1, isFolder: false },
  { path: "registry.json", depth: 0, isFolder: false },
]

const SCRIPT = [
  { cursor: "app", open: ["app"], keyLabel: "" },
  { cursor: "app/(marketing)", open: ["app"], keyLabel: "↓" },
  { cursor: "app/components", open: ["app"], keyLabel: "↓" },
  { cursor: "app/components", open: ["app", "app/components"], keyLabel: "→" },
  {
    cursor: "app/components/button.tsx",
    open: ["app", "app/components"],
    keyLabel: "↓",
  },
  {
    cursor: "app/components/dialog.tsx",
    open: ["app", "app/components"],
    keyLabel: "↓",
  },
  {
    cursor: "app/components/dialog.tsx",
    open: ["app", "app/components"],
    keyLabel: "⏎",
    selected: "app/components/dialog.tsx",
  },
  {
    cursor: "app/components",
    open: ["app", "app/components"],
    keyLabel: "←",
    selected: "app/components/dialog.tsx",
  },
  { cursor: "app/components", open: ["app"], keyLabel: "←" },
  { cursor: "app", open: ["app"], keyLabel: "↑" },
]

function parentPath(path: string) {
  return path.split("/").slice(0, -1).join("/")
}

export function LiveTreeView() {
  const cursorLayoutId = useId()
  const frame = useDemoFrame({
    frameMs: 950,
    frameCount: SCRIPT.length,
    reducedMotionFrame: 6,
  })
  const step = SCRIPT[frame]
  const visibleNodes = TREE.filter((node) => {
    const parent = parentPath(node.path)
    return parent === "" || step.open.includes(parent)
  })

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {step.keyLabel && (
          <motion.kbd
            key={`${frame}-${step.keyLabel}`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute top-0 right-0 flex h-6 min-w-6 items-center justify-center rounded-md border bg-muted px-1.5 font-mono text-[11px]"
          >
            {step.keyLabel}
          </motion.kbd>
        )}
      </AnimatePresence>
      <ul className="relative flex min-h-[196px] w-full flex-col font-mono text-xs">
        <AnimatePresence mode="popLayout" initial={false}>
          {visibleNodes.map((node) => (
            <motion.li
              key={node.path}
              layout
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={DEMO_SPRING}
              style={{ paddingLeft: node.depth * 14 + 6 }}
              className={cn(
                "relative isolate flex h-7 items-center gap-1.5",
                step.selected === node.path && "font-semibold"
              )}
            >
              {step.cursor === node.path && (
                <motion.span
                  layoutId={cursorLayoutId}
                  transition={DEMO_SPRING}
                  className="absolute inset-0 -z-10 rounded-md bg-accent ring-1 ring-ring/40"
                />
              )}
              {node.isFolder ? (
                <ChevronRightIcon
                  className={cn(
                    "size-3.5 text-muted-foreground transition-transform duration-200",
                    step.open.includes(node.path) && "rotate-90"
                  )}
                />
              ) : (
                <FileIcon className="size-3.5 text-muted-foreground" />
              )}
              {node.path.split("/").at(-1)}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}
