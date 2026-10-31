import { DiffViewer } from "@/registry/default/ui/diff-viewer"

const LINES = Array.from({ length: 12 }, (_, index) => `line ${index + 1}`)

const BEFORE = LINES.join("\n")
const AFTER = LINES.map((line, index) =>
  index === 5 ? "line 6, reviewed" : line
).join("\n")

export function DiffViewerContextLinesPreview() {
  return (
    <DiffViewer
      aria-label="Changes to notes.txt"
      oldValue={BEFORE}
      newValue={AFTER}
      contextLines={1}
      className="w-full max-w-2xl"
    />
  )
}
