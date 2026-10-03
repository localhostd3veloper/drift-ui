"use client"

import * as React from "react"
import { XIcon } from "lucide-react"

import { cn } from "@/registry/default/lib/utils"
import {
  operatorLabel,
  operatorsFor,
  type Filter,
  type FilterField,
} from "@/registry/default/lib/filter"
import { FilterMenu, FilterMenuItem } from "@/registry/default/ui/filter-menu"
import { Input } from "@/registry/default/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover"

const segmentClassName =
  "flex items-center gap-1.5 px-2 outline-none hover:bg-accent focus-visible:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset data-[state=open]:bg-accent [&_svg]:size-3.5"

function ValueLabel({ text }: { text: string }) {
  if (!text) return <span className="text-muted-foreground">Any</span>
  return <span className="max-w-40 truncate font-medium">{text}</span>
}

function SelectValueEditor({
  field,
  filter,
  defaultOpen,
  onCommit,
  onDismissEmpty,
}: FilterValueEditorProps) {
  const hasPickedRef = React.useRef(false)
  const selected = field.options?.find(
    (option) => option.value === filter.value
  )

  return (
    <FilterMenu
      defaultOpen={defaultOpen}
      onOpenChange={(open) => {
        if (open || filter.value || hasPickedRef.current) return
        onDismissEmpty()
      }}
      trigger={
        <button
          type="button"
          aria-label={`${field.label} value`}
          className={segmentClassName}
        >
          <ValueLabel text={selected?.label ?? ""} />
        </button>
      }
    >
      {field.options?.map((option) => (
        <FilterMenuItem
          key={option.value}
          isSelected={option.value === filter.value}
          onSelect={() => {
            hasPickedRef.current = true
            onCommit(option.value)
          }}
        >
          {option.label}
        </FilterMenuItem>
      ))}
    </FilterMenu>
  )
}

function TypedValueEditor({
  field,
  filter,
  defaultOpen,
  onCommit,
  onDismissEmpty,
}: FilterValueEditorProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  const [draft, setDraft] = React.useState(filter.value)

  function handleOpenChange(open: boolean) {
    setIsOpen(open)
    if (open) return setDraft(filter.value)
    if (draft.trim()) return onCommit(draft.trim())
    onDismissEmpty()
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`${field.label} value`}
          className={segmentClassName}
        >
          <ValueLabel text={filter.value} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-2">
        <Input
          autoFocus
          aria-label={`${field.label} value`}
          type={field.type === "number" ? "number" : "text"}
          value={draft}
          placeholder={`Filter by ${field.label.toLowerCase()}`}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleOpenChange(false)
          }}
          className="h-8"
        />
      </PopoverContent>
    </Popover>
  )
}

type FilterValueEditorProps = {
  field: FilterField
  filter: Filter
  defaultOpen: boolean
  onCommit: (value: string) => void
  onDismissEmpty: () => void
}

function FilterChip({
  field,
  filter,
  isNew = false,
  onFilterChange,
  onRemove,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "onChange"> & {
  field: FilterField
  filter: Filter
  isNew?: boolean
  onFilterChange: (filter: Filter) => void
  onRemove: () => void
}) {
  const ValueEditor =
    field.type === "select" ? SelectValueEditor : TypedValueEditor

  return (
    <div
      data-slot="filter-chip"
      className={cn(
        "inline-flex h-8 items-stretch divide-x overflow-hidden rounded-md border bg-background text-sm shadow-xs dark:bg-input/30",
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-1.5 px-2 text-muted-foreground [&_svg]:size-3.5">
        {field.icon}
        {field.label}
      </span>
      <FilterMenu
        trigger={
          <button
            type="button"
            aria-label={`${field.label} operator`}
            className={cn(segmentClassName, "text-muted-foreground")}
          >
            {operatorLabel(filter.operator)}
          </button>
        }
      >
        {operatorsFor(field.type).map((operator) => (
          <FilterMenuItem
            key={operator}
            isSelected={operator === filter.operator}
            onSelect={() => onFilterChange({ ...filter, operator })}
          >
            {operatorLabel(operator)}
          </FilterMenuItem>
        ))}
      </FilterMenu>
      <ValueEditor
        field={field}
        filter={filter}
        defaultOpen={isNew}
        onCommit={(value) => onFilterChange({ ...filter, value })}
        onDismissEmpty={onRemove}
      />
      <button
        type="button"
        aria-label={`Remove ${field.label} filter`}
        onClick={onRemove}
        className={segmentClassName}
      >
        <XIcon />
      </button>
    </div>
  )
}

export { FilterChip }
