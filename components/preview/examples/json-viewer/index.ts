import { JsonViewerExpandDepthPreview } from "@/components/preview/examples/json-viewer/expand-depth"
import { JsonViewerOnCopyPreview } from "@/components/preview/examples/json-viewer/on-copy"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "expand-depth",
    title: "Start collapsed",
    description:
      "defaultExpandDepth={0} opens only the root, for large payloads people want to explore a level at a time.",
    Preview: JsonViewerExpandDepthPreview,
  },
  {
    id: "on-copy",
    title: "React to copying",
    description:
      "onCopy runs after a value or path is copied, so you can confirm it or record it. Hover a row to see the copy buttons.",
    Preview: JsonViewerOnCopyPreview,
  },
]
