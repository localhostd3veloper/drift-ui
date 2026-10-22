"use client"

import { XIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/registry/default/lib/utils"
import { Badge } from "@/registry/default/ui/badge"
import { DEMO_SPRING } from "@/components/landing/live/demo-spring"
import { useDemoFrame } from "@/components/landing/use-demo-frame"

const BASE_TAGS = ["billing", "eu-west-1"]
const TYPED_TAG = "canary"
const COMMITTED_AT = TYPED_TAG.length
const BACKSPACE_AT = COMMITTED_AT + 6
const REMOVED_AT = BACKSPACE_AT + 2
const FRAME_COUNT = REMOVED_AT + 4

function tagsAtFrame(frame: number) {
  if (frame < COMMITTED_AT) {
    return {
      tags: BASE_TAGS,
      draft: TYPED_TAG.slice(0, frame + 1),
      isLastSelected: false,
    }
  }
  if (frame < BACKSPACE_AT)
    return { tags: [...BASE_TAGS, TYPED_TAG], draft: "", isLastSelected: false }
  if (frame < REMOVED_AT)
    return { tags: [...BASE_TAGS, TYPED_TAG], draft: "", isLastSelected: true }
  return { tags: BASE_TAGS, draft: "", isLastSelected: false }
}

export function LiveTagsInput() {
  const frame = useDemoFrame({
    frameMs: 230,
    frameCount: FRAME_COUNT,
    reducedMotionFrame: COMMITTED_AT,
  })
  const { tags, draft, isLastSelected } = tagsAtFrame(frame)

  return (
    <div className="relative flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-ring/60 bg-input/30 px-2 py-1.5 text-sm ring-[3px] ring-ring/20">
      <AnimatePresence mode="popLayout" initial={false}>
        {tags.map((tag, index) => (
          <motion.span
            key={tag}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={DEMO_SPRING}
          >
            <Badge
              variant="secondary"
              className={cn(
                "gap-1 pr-1 transition-shadow",
                isLastSelected &&
                  index === tags.length - 1 &&
                  "ring-2 ring-ring"
              )}
            >
              {tag}
              <XIcon className="text-muted-foreground" />
            </Badge>
          </motion.span>
        ))}
      </AnimatePresence>
      <motion.span
        layout
        transition={DEMO_SPRING}
        className="flex items-center gap-px"
      >
        {draft || <span className="text-muted-foreground">Add tag</span>}
        <span className="h-4 w-px animate-pulse bg-foreground" />
      </motion.span>
    </div>
  )
}
