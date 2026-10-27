"use client"

import { useRef, useState } from "react"
import { FileUpIcon } from "lucide-react"

import { Button } from "@/registry/default/ui/button"
import { DialogFooter } from "@/registry/default/ui/dialog"
import {
  countTokens,
  formatThemeCss,
  isEmptyTheme,
  parseThemeCss,
  type Theme,
} from "@/lib/theme-css"

const PLACEHOLDER = `/* Paste your globals.css here */

:root {
  --radius: 0.5rem;
  --primary: oklch(0.55 0.2 260);
}

.dark {
  --primary: oklch(0.75 0.12 260);
}`

function describeDraft(draft: string, theme: Theme) {
  const counts = countTokens(theme)
  if (!draft.trim()) return "Paste your CSS or open your globals.css file."
  if (counts.light + counts.dark === 0) {
    return "No tokens found. Include the :root and .dark blocks."
  }
  const summary = `Found ${counts.light} light and ${counts.dark} dark tokens.`
  if (counts.dark === 0)
    return `${summary} Dark mode will use the light values.`
  return summary
}

export function ThemeCssEditor({
  theme,
  onApply,
  onCancel,
}: {
  theme: Theme
  onApply: (theme: Theme) => void
  onCancel: () => void
}) {
  const [draft, setDraft] = useState(() => formatThemeCss(theme))
  const fileInputRef = useRef<HTMLInputElement>(null)

  const draftTheme = parseThemeCss(draft)
  const hasTokens = !isEmptyTheme(draftTheme)

  function applyDraft() {
    if (hasTokens) onApply(draftTheme)
  }

  async function loadFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    setDraft(await file.text())
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || !(event.metaKey || event.ctrlKey)) return
    event.preventDefault()
    applyDraft()
  }

  return (
    <>
      <div className="flex min-w-0 flex-col gap-2">
        <textarea
          aria-label="Theme CSS"
          aria-describedby="theme-css-status"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDER}
          spellCheck={false}
          wrap="off"
          autoFocus
          className="h-[min(50vh,26rem)] w-full resize-none overflow-auto rounded-md border bg-muted/40 p-3 font-mono text-xs leading-5 whitespace-pre outline-none placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
        <p
          id="theme-css-status"
          aria-live="polite"
          className="text-xs text-muted-foreground"
        >
          {describeDraft(draft, draftTheme)}
        </p>
      </div>
      <DialogFooter className="gap-2 sm:justify-between">
        <input
          ref={fileInputRef}
          type="file"
          accept=".css,text/css"
          hidden
          onChange={loadFile}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <FileUpIcon />
          Open file
        </Button>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" disabled={!hasTokens} onClick={applyDraft}>
            Apply theme
          </Button>
        </div>
      </DialogFooter>
    </>
  )
}
