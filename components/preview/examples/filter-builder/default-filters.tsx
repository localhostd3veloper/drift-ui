import type { Filter, FilterField } from "@/registry/default/lib/filter"
import { FilterBuilder } from "@/registry/default/ui/filter-builder"

const FIELDS: FilterField[] = [
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "open", label: "Open" },
      { value: "closed", label: "Closed" },
    ],
  },
  { id: "points", label: "Points", type: "number" },
]

const SAVED_VIEW: Filter[] = [
  { id: "1", fieldId: "status", operator: "is", value: "open" },
  { id: "2", fieldId: "points", operator: "gt", value: "2" },
]

export function FilterBuilderDefaultFiltersPreview() {
  return (
    <FilterBuilder
      aria-label="Saved view"
      fields={FIELDS}
      defaultValue={SAVED_VIEW}
      className="w-full max-w-xl"
    />
  )
}
