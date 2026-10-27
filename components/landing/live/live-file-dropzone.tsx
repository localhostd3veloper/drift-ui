"use client"

import { CheckIcon, FileTextIcon, UploadIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/registry/default/lib/utils"
import { DEMO_SPRING } from "@/components/landing/live/demo-spring"
import { useDemoFrame } from "@/components/landing/use-demo-frame"

const FILES = [
  { name: "brand-guidelines.pdf", size: "2.4 MB" },
  { name: "q3-roadmap.png", size: "860 KB" },
]
const DRAG_FRAMES = 4
const UPLOAD_FRAMES = 20
const DONE_FRAMES = 8
const FRAMES_PER_FILE = DRAG_FRAMES + UPLOAD_FRAMES + DONE_FRAMES

function uploadAtFrame(frame: number) {
  const file = FILES[Math.floor(frame / FRAMES_PER_FILE)]
  const fileFrame = frame % FRAMES_PER_FILE
  if (fileFrame < DRAG_FRAMES)
    return { file, isDragging: true, progress: 0, isDone: false }
  const uploadFrame = fileFrame - DRAG_FRAMES
  if (uploadFrame < UPLOAD_FRAMES)
    return {
      file,
      isDragging: false,
      progress: (uploadFrame + 1) / UPLOAD_FRAMES,
      isDone: false,
    }
  return { file, isDragging: false, progress: 1, isDone: true }
}

export function LiveFileDropzone({
  frame: frameOverride,
}: { frame?: number } = {}) {
  const clockFrame = useDemoFrame({
    frameMs: 110,
    frameCount: FRAMES_PER_FILE * FILES.length,
    reducedMotionFrame: FRAMES_PER_FILE - 1,
  })
  const frame = frameOverride ?? clockFrame
  const { file, isDragging, progress, isDone } = uploadAtFrame(frame)

  return (
    <div className="flex w-full flex-col gap-2">
      <motion.div
        animate={{ scale: isDragging ? 1.02 : 1 }}
        transition={DEMO_SPRING}
        className={cn(
          "flex flex-col items-center gap-1.5 rounded-lg border border-dashed border-input px-4 py-5 text-center transition-colors",
          isDragging && "border-foreground/60 bg-accent/60"
        )}
      >
        <motion.span
          animate={{ y: isDragging ? -3 : 0 }}
          transition={DEMO_SPRING}
        >
          <UploadIcon className="size-4 text-muted-foreground" />
        </motion.span>
        <p className="text-xs">
          {isDragging ? "Release to upload" : "Drop files or browse"}
        </p>
        <p className="text-[11px] text-muted-foreground">
          PDF, PNG up to 20 MB
        </p>
      </motion.div>
      <div className="relative h-[46px]">
        <AnimatePresence mode="popLayout" initial={false}>
          {!isDragging && (
            <motion.div
              key={file.name}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={DEMO_SPRING}
              className="flex items-center gap-2.5 rounded-md border px-2.5 py-2"
            >
              <FileTextIcon className="size-4 shrink-0 text-muted-foreground" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="truncate">{file.name}</span>
                  <span className="font-mono text-muted-foreground tabular-nums">
                    {isDone ? file.size : `${Math.round(progress * 100)}%`}
                  </span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full origin-left rounded-full bg-foreground"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: progress }}
                    transition={{ duration: 0.11, ease: "linear" }}
                  />
                </div>
              </div>
              <AnimatePresence>
                {isDone && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{
                      type: "spring",
                      bounce: 0.4,
                      visualDuration: 0.3,
                    }}
                    className="flex size-4 items-center justify-center rounded-full bg-emerald-400 text-background"
                  >
                    <CheckIcon className="size-3" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
