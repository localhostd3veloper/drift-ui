import { DiffViewerContextLinesPreview } from "@/components/preview/examples/diff-viewer/context-lines"
import { DiffViewerUnifiedPreview } from "@/components/preview/examples/diff-viewer/unified"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "unified",
    title: "Unified",
    description:
      'mode="unified" puts both sides in one column, which suits narrow panels.',
    Preview: DiffViewerUnifiedPreview,
  },
  {
    id: "context-lines",
    title: "Context lines",
    description:
      "contextLines sets how many unchanged lines stay beside each change. The rest collapse behind a button.",
    Preview: DiffViewerContextLinesPreview,
  },
]
