"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/default/ui/dialog"
import { ThemeCssEditor } from "@/components/showcase/theme-css-editor"
import type { Theme } from "@/lib/theme-css"

export function ThemeCssDialog({
  theme,
  onApply,
  children,
}: {
  theme: Theme
  onApply: (theme: Theme) => void
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)

  function applyAndClose(next: Theme) {
    onApply(next)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent data-theme-editor className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Theme CSS</DialogTitle>
          <DialogDescription>
            Paste your globals.css or open the file. Only the tokens inside
            :root and .dark are read, everything else is ignored.
          </DialogDescription>
        </DialogHeader>
        <ThemeCssEditor
          theme={theme}
          onApply={applyAndClose}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
