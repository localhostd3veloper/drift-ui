import { FilterBuilderControlledPreview } from "@/components/preview/examples/filter-builder/controlled"
import { FilterBuilderDefaultFiltersPreview } from "@/components/preview/examples/filter-builder/default-filters"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "default-filters",
    title: "Starting filters",
    description:
      "defaultValue opens with filters applied, for saved views. Each filter is { id, fieldId, operator, value }.",
    Preview: FilterBuilderDefaultFiltersPreview,
  },
  {
    id: "controlled",
    title: "Controlled",
    description:
      "value and onValueChange give you the filters as data to store in the URL or send to an API.",
    Preview: FilterBuilderControlledPreview,
  },
]
