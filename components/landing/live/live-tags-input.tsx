"use client"

import { XIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/registry/default/lib/utils"
import { Badge } from "@/registry/default/ui/badge"
import { useDemoFrame } from "@/components/landing/use-demo-frame"

const BASE_TAGS = ["billing", "eu-west-1"]
const TYPED_TAG = "canary"
const COMMITTED_AT = TYPED_TAG.length
const BACKSPACE_AT = COMMITTED_AT + 6
const REMOVED_AT = BACKSPACE_AT + 2
const FRAME_COUNT = REMOVED_AT + 4
const TAG_TRANSITION = { duration: 0.18, ease: "easeOut" } as const

function tagsAtFrame(frame: number, baseTags: string[]) {
  if (frame < COMMITTED_AT) {
    return {
      tags: baseTags,
      draft: TYPED_TAG.slice(0, frame + 1),
      isLastSelected: false,
    }
  }
  if (frame < BACKSPACE_AT)
    return { tags: [...baseTags, TYPED_TAG], draft: "", isLastSelected: false }
  if (frame < REMOVED_AT)
    return { tags: [...baseTags, TYPED_TAG], draft: "", isLastSelected: true }
  return { tags: baseTags, draft: "", isLastSelected: false }
}

export function LiveTagsInput({
  frame: frameOverride,
  baseTags = BASE_TAGS,
}: { frame?: number; baseTags?: string[] } = {}) {
  const clockFrame = useDemoFrame({
    frameMs: 230,
    frameCount: FRAME_COUNT,
    reducedMotionFrame: COMMITTED_AT,
  })
  const frame = frameOverride ?? clockFrame
  const { tags, draft, isLastSelected } = tagsAtFrame(frame, baseTags)
  const showsPlaceholder = !draft && tags.length === baseTags.length

  return (
    <div className="relative flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-ring/60 bg-input/30 px-2 py-1.5 text-sm ring-[3px] ring-ring/20">
      <AnimatePresence mode="popLayout" initial={false}>
        {tags.map((tag, index) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={TAG_TRANSITION}
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
      <span className="flex items-center gap-px">
        {draft}
        <span
          key={draft}
          className="h-4 w-px animate-type-caret bg-foreground motion-reduce:animate-none"
        />
        {showsPlaceholder && (
          <span className="text-muted-foreground">Add tag</span>
        )}
      </span>
    </div>
  )
}
