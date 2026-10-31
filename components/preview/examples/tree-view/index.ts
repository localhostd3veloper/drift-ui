import { TreeViewControlledPreview } from "@/components/preview/examples/tree-view/controlled"
import { TreeViewDisabledPreview } from "@/components/preview/examples/tree-view/disabled"
import { TreeViewLazyPreview } from "@/components/preview/examples/tree-view/lazy"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "controlled",
    title: "Expand and collapse all",
    description:
      "expanded and onExpandedChange put the open branches in your hands, so buttons outside the tree can drive them.",
    Preview: TreeViewControlledPreview,
  },
  {
    id: "lazy",
    title: "Load children on demand",
    description:
      "A node with isBranch and no children shows a loading row while open. Fetch its children in onExpandedChange.",
    Preview: TreeViewLazyPreview,
  },
  {
    id: "disabled",
    title: "Disabled nodes",
    description:
      "disabled nodes stay visible but are skipped by selection and the arrow keys.",
    Preview: TreeViewDisabledPreview,
  },
]
