"use client"

import * as React from "react"
import { ListFilterIcon } from "lucide-react"

import { cn } from "@/registry/default/lib/utils"
import {
  createFilter,
  type Filter,
  type FilterField,
} from "@/registry/default/lib/filter"
import { useControllableState } from "@/registry/default/hooks/use-controllable-state"
import { Button } from "@/registry/default/ui/button"
import { FilterChip } from "@/registry/default/ui/filter-chip"
import { FilterMenu, FilterMenuItem } from "@/registry/default/ui/filter-menu"

function FilterBuilder({
  fields,
  value,
  defaultValue = [],
  onValueChange,
  "aria-label": ariaLabel = "Filters",
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> & {
  fields: FilterField[]
  value?: Filter[]
  defaultValue?: Filter[]
  onValueChange?: (filters: Filter[]) => void
}) {
  const { value: filters, setValue: setFilters } = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })
  const [newFilterId, setNewFilterId] = React.useState<string | null>(null)
  const didAddFilterRef = React.useRef(false)
  const fieldsById = new Map(fields.map((field) => [field.id, field]))

  function addFilter(field: FilterField) {
    const filter = createFilter(field)
    setFilters((current) => [...current, filter])
    setNewFilterId(filter.id)
    didAddFilterRef.current = true
  }

  function updateFilter(next: Filter) {
    setFilters((current) =>
      current.map((filter) => (filter.id === next.id ? next : filter))
    )
  }

  function removeFilter(id: string) {
    setFilters((current) => current.filter((filter) => filter.id !== id))
  }

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      data-slot="filter-builder"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    >
      {filters.map((filter) => {
        const field = fieldsById.get(filter.fieldId)
        if (!field) return null
        return (
          <FilterChip
            key={filter.id}
            field={field}
            filter={filter}
            isNew={filter.id === newFilterId}
            onFilterChange={updateFilter}
            onRemove={() => removeFilter(filter.id)}
          />
        )
      })}
      <FilterMenu
        onCloseAutoFocus={(event) => {
          if (!didAddFilterRef.current) return
          didAddFilterRef.current = false
          event.preventDefault()
        }}
        trigger={
          <Button
            variant="outline"
            size="sm"
            data-slot="filter-builder-add"
            aria-label="Add filter"
            className="border-dashed"
          >
            <ListFilterIcon />
            {filters.length === 0 && "Filter"}
          </Button>
        }
      >
        {fields.map((field) => (
          <FilterMenuItem key={field.id} onSelect={() => addFilter(field)}>
            {field.icon}
            {field.label}
          </FilterMenuItem>
        ))}
      </FilterMenu>
      {filters.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          data-slot="filter-builder-clear"
          onClick={() => setFilters([])}
        >
          Clear
        </Button>
      )}
    </div>
  )
}

export { FilterBuilder }
