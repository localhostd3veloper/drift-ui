import { DescriptionListAsyncSavePreview } from "@/components/preview/examples/description-list/async-save"
import { DescriptionListCopyablePreview } from "@/components/preview/examples/description-list/copyable"
import { DescriptionListPlaceholderPreview } from "@/components/preview/examples/description-list/placeholder"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "copyable",
    title: "Copy values",
    description:
      "copyable adds a button that copies the row's text, for ids and keys people paste elsewhere.",
    Preview: DescriptionListCopyablePreview,
  },
  {
    id: "async-save",
    title: "Saving to a server",
    description:
      "Return a promise from onValueChange. The row stays read-only while it is pending and stays open if it rejects, so try clearing the field.",
    Preview: DescriptionListAsyncSavePreview,
  },
  {
    id: "placeholder",
    title: "Empty rows",
    description:
      "placeholder fills an editable row that has no value yet, so it still reads as something to click.",
    Preview: DescriptionListPlaceholderPreview,
  },
]
