"use client"

import {
  CheckIcon,
  ClipboardPasteIcon,
  CopyIcon,
  FileCode2Icon,
  PencilIcon,
} from "lucide-react"

import { Button } from "@/registry/default/ui/button"
import { ThemeCssDialog } from "@/components/showcase/theme-css-dialog"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import {
  countTokens,
  formatThemeCss,
  isEmptyTheme,
  type Theme,
} from "@/lib/theme-css"

export function ThemeCssSummary({
  theme,
  onApply,
}: {
  theme: Theme
  onApply: (theme: Theme) => void
}) {
  const { hasCopied, copy } = useCopyToClipboard()
  const counts = countTokens(theme)
  const isEmpty = isEmptyTheme(theme)

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-3">
      <div className="flex items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <FileCode2Icon className="size-4" />
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="font-mono text-xs">globals.css</span>
          <span className="text-xs text-muted-foreground">
            {isEmpty
              ? "Bring your own theme"
              : `${counts.light} light, ${counts.dark} dark tokens`}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <ThemeCssDialog theme={theme} onApply={onApply}>
          <Button size="sm" variant="outline" className="flex-1">
            {isEmpty ? <ClipboardPasteIcon /> : <PencilIcon />}
            {isEmpty ? "Paste CSS" : "Edit CSS"}
          </Button>
        </ThemeCssDialog>
        {!isEmpty && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => copy(formatThemeCss(theme))}
          >
            {hasCopied ? <CheckIcon /> : <CopyIcon />}
            {hasCopied ? "Copied" : "Copy"}
          </Button>
        )}
      </div>
    </div>
  )
}
