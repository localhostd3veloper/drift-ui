"use client"

import * as React from "react"
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MinusIcon,
  SearchIcon,
  XIcon,
} from "lucide-react"

import { cn } from "@/registry/default/lib/utils"
import { useControllableState } from "@/registry/default/hooks/use-controllable-state"
import {
  filterTransferItems,
  getTransferAnnouncement,
  moveAll,
  moveItems,
  partitionItems,
  selectRange,
  type TransferItem,
} from "@/registry/default/lib/transfer-list"
import { Button } from "@/registry/default/ui/button"

function SelectionMark({
  checked,
  indeterminate,
}: {
  checked: boolean
  indeterminate?: boolean
}) {
  return (
    <span
      data-checked={checked ? "" : undefined}
      className="flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors data-[checked]:border-primary data-[checked]:bg-primary data-[checked]:text-primary-foreground"
    >
      {checked && <CheckIcon className="size-3 stroke-[3]" />}
      {indeterminate && !checked && (
        <MinusIcon className="size-3 stroke-[3] text-foreground" />
      )}
    </span>
  )
}

export interface TransferListProps<
  T extends TransferItem = TransferItem,
> extends Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> {
  items: T[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  titles?: [string, string]
  searchable?: boolean
  showSelectAll?: boolean
  disabled?: boolean
  getKey?: (item: T) => string
  renderItem?: (item: T) => React.ReactNode
}

export function TransferList<T extends TransferItem = TransferItem>({
  items,
  value,
  defaultValue = [],
  onValueChange,
  titles = ["Available", "Selected"],
  searchable = false,
  showSelectAll = true,
  disabled = false,
  getKey = (item) => item.id,
  renderItem,
  className,
  ...props
}: TransferListProps<T>) {
  const { value: selectedIds, setValue: setSelectedIds } = useControllableState(
    {
      value,
      defaultValue,
      onChange: onValueChange,
    }
  )

  const [checkedSourceIds, setCheckedSourceIds] = React.useState<string[]>([])
  const [checkedTargetIds, setCheckedTargetIds] = React.useState<string[]>([])
  const [sourceQuery, setSourceQuery] = React.useState("")
  const [targetQuery, setTargetQuery] = React.useState("")
  const [lastSourceId, setLastSourceId] = React.useState<string | null>(null)
  const [lastTargetId, setLastTargetId] = React.useState<string | null>(null)
  const [announcement, setAnnouncement] = React.useState("")

  const { sourceItems, targetItems } = partitionItems(
    items,
    selectedIds,
    getKey
  )

  const filteredSourceItems = filterTransferItems(sourceItems, sourceQuery)
  const filteredTargetItems = filterTransferItems(targetItems, targetQuery)

  const activeSourceKeys = filteredSourceItems
    .filter((item) => !item.disabled)
    .map(getKey)
  const activeTargetKeys = filteredTargetItems
    .filter((item) => !item.disabled)
    .map(getKey)

  const isAllSourceChecked =
    activeSourceKeys.length > 0 &&
    activeSourceKeys.every((id) => checkedSourceIds.includes(id))
  const isSomeSourceChecked =
    activeSourceKeys.some((id) => checkedSourceIds.includes(id)) &&
    !isAllSourceChecked

  const isAllTargetChecked =
    activeTargetKeys.length > 0 &&
    activeTargetKeys.every((id) => checkedTargetIds.includes(id))
  const isSomeTargetChecked =
    activeTargetKeys.some((id) => checkedTargetIds.includes(id)) &&
    !isAllTargetChecked

  function handleToggleAllSource() {
    if (disabled) return
    if (isAllSourceChecked) {
      setCheckedSourceIds((current) =>
        current.filter((id) => !activeSourceKeys.includes(id))
      )
    } else {
      setCheckedSourceIds((current) =>
        Array.from(new Set([...current, ...activeSourceKeys]))
      )
    }
  }

  function handleToggleAllTarget() {
    if (disabled) return
    if (isAllTargetChecked) {
      setCheckedTargetIds((current) =>
        current.filter((id) => !activeTargetKeys.includes(id))
      )
    } else {
      setCheckedTargetIds((current) =>
        Array.from(new Set([...current, ...activeTargetKeys]))
      )
    }
  }

  function handleItemClick(
    item: T,
    side: "source" | "target",
    event: React.MouseEvent
  ) {
    if (disabled || item.disabled) return
    const key = getKey(item)
    const isShift = event.shiftKey
    const listKeys =
      side === "source"
        ? filteredSourceItems.map(getKey)
        : filteredTargetItems.map(getKey)
    const lastId = side === "source" ? lastSourceId : lastTargetId
    const currentChecked =
      side === "source" ? checkedSourceIds : checkedTargetIds
    const setChecked =
      side === "source" ? setCheckedSourceIds : setCheckedTargetIds

    if (isShift && lastId) {
      setChecked(selectRange(listKeys, lastId, key, currentChecked))
    } else {
      setChecked((current) =>
        current.includes(key)
          ? current.filter((id) => id !== key)
          : [...current, key]
      )
    }

    if (side === "source") {
      setLastSourceId(key)
    } else {
      setLastTargetId(key)
    }
  }

  function handleItemDoubleClick(item: T, side: "source" | "target") {
    if (disabled || item.disabled) return
    const key = getKey(item)
    if (side === "source") {
      const next = moveItems(selectedIds, [key], "toTarget")
      setSelectedIds(next)
      setCheckedSourceIds((current) => current.filter((id) => id !== key))
      setAnnouncement(getTransferAnnouncement(1, "toTarget", titles))
    } else {
      const next = moveItems(selectedIds, [key], "toSource")
      setSelectedIds(next)
      setCheckedTargetIds((current) => current.filter((id) => id !== key))
      setAnnouncement(getTransferAnnouncement(1, "toSource", titles))
    }
  }

  function handleMoveToTarget() {
    if (disabled || checkedSourceIds.length === 0) return
    const idsToMove = checkedSourceIds.filter((id) =>
      sourceItems.some((item) => getKey(item) === id && !item.disabled)
    )
    if (idsToMove.length === 0) return

    const next = moveItems(selectedIds, idsToMove, "toTarget")
    setSelectedIds(next)
    setCheckedSourceIds([])
    setAnnouncement(
      getTransferAnnouncement(idsToMove.length, "toTarget", titles)
    )
  }

  function handleMoveAllToTarget() {
    if (disabled || sourceItems.length === 0) return
    const next = moveAll(items, selectedIds, "toTarget", getKey)
    setSelectedIds(next)
    setCheckedSourceIds([])
    const movedCount = next.length - selectedIds.length
    if (movedCount > 0) {
      setAnnouncement(getTransferAnnouncement(movedCount, "toTarget", titles))
    }
  }

  function handleMoveToSource() {
    if (disabled || checkedTargetIds.length === 0) return
    const idsToMove = checkedTargetIds.filter((id) =>
      targetItems.some((item) => getKey(item) === id && !item.disabled)
    )
    if (idsToMove.length === 0) return

    const next = moveItems(selectedIds, idsToMove, "toSource")
    setSelectedIds(next)
    setCheckedTargetIds([])
    setAnnouncement(
      getTransferAnnouncement(idsToMove.length, "toSource", titles)
    )
  }

  function handleMoveAllToSource() {
    if (disabled || targetItems.length === 0) return
    const next = moveAll(items, selectedIds, "toSource", getKey)
    setSelectedIds(next)
    setCheckedTargetIds([])
    const movedCount = selectedIds.length - next.length
    if (movedCount > 0) {
      setAnnouncement(getTransferAnnouncement(movedCount, "toSource", titles))
    }
  }

  function renderListPanel(
    side: "source" | "target",
    title: string,
    listItems: T[],
    checkedIds: string[],
    query: string,
    setQuery: (q: string) => void,
    onToggleAll: () => void,
    isAllChecked: boolean,
    isSomeChecked: boolean
  ) {
    const listboxId = `transfer-listbox-${side}`
    const checkedCount = checkedIds.filter((id) =>
      listItems.some((item) => getKey(item) === id)
    ).length

    return (
      <div
        className={cn(
          "flex min-w-[240px] flex-1 flex-col rounded-lg border border-border bg-card text-card-foreground shadow-xs transition-opacity",
          disabled && "opacity-60"
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
          <div className="flex items-center gap-2">
            {showSelectAll && (
              <button
                type="button"
                aria-label={`Select all ${title}`}
                disabled={disabled || listItems.length === 0}
                onClick={onToggleAll}
                className="flex items-center justify-center rounded p-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <SelectionMark
                  checked={isAllChecked}
                  indeterminate={isSomeChecked}
                />
              </button>
            )}
            <span className="text-sm font-medium">{title}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {checkedCount} / {listItems.length}
          </span>
        </div>

        {searchable && (
          <div className="relative border-b border-border p-2">
            <SearchIcon className="absolute top-1/2 left-4 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${title.toLowerCase()}...`}
              disabled={disabled}
              className="h-8 w-full rounded-md border border-input bg-transparent pr-7 pl-8 text-xs shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="absolute top-1/2 right-3.5 -translate-y-1/2 rounded text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <XIcon className="size-3" />
              </button>
            )}
          </div>
        )}

        <ul
          id={listboxId}
          role="listbox"
          aria-multiselectable="true"
          aria-label={title}
          className="h-64 overflow-y-auto p-1.5 focus-visible:outline-none"
        >
          {listItems.length === 0 ? (
            <li className="flex h-full items-center justify-center p-4 text-center text-xs text-muted-foreground">
              No items
            </li>
          ) : (
            listItems.map((item) => {
              const key = getKey(item)
              const isChecked = checkedIds.includes(key)
              return (
                <li
                  key={key}
                  role="option"
                  aria-selected={isChecked}
                  tabIndex={disabled || item.disabled ? -1 : 0}
                  onClick={(e) => handleItemClick(item, side, e)}
                  onDoubleClick={() => handleItemDoubleClick(item, side)}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault()
                      handleItemClick(
                        item,
                        side,
                        e as unknown as React.MouseEvent
                      )
                    }
                  }}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs transition-colors select-none",
                    isChecked
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted/60",
                    item.disabled &&
                      "cursor-not-allowed opacity-40 hover:bg-transparent",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  )}
                >
                  <SelectionMark checked={isChecked} />
                  <div className="flex min-w-0 flex-1 flex-col">
                    {renderItem ? (
                      renderItem(item)
                    ) : (
                      <>
                        <span className="truncate font-medium">
                          {item.label}
                        </span>
                        {item.description && (
                          <span className="truncate text-[10px] text-muted-foreground">
                            {item.description}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </li>
              )
            })
          )}
        </ul>
      </div>
    )
  }

  return (
    <div
      role="group"
      aria-label="Transfer list"
      className={cn("flex flex-col items-center gap-3 sm:flex-row", className)}
      {...props}
    >
      {renderListPanel(
        "source",
        titles[0],
        filteredSourceItems,
        checkedSourceIds,
        sourceQuery,
        setSourceQuery,
        handleToggleAllSource,
        isAllSourceChecked,
        isSomeSourceChecked
      )}

      <div className="flex flex-row gap-1 sm:flex-col">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Move all to ${titles[1]}`}
          disabled={
            disabled || sourceItems.filter((i) => !i.disabled).length === 0
          }
          onClick={handleMoveAllToTarget}
          className="size-8"
        >
          <ChevronsRightIcon className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Move selected to ${titles[1]}`}
          disabled={disabled || checkedSourceIds.length === 0}
          onClick={handleMoveToTarget}
          className="size-8"
        >
          <ChevronRightIcon className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Move selected to ${titles[0]}`}
          disabled={disabled || checkedTargetIds.length === 0}
          onClick={handleMoveToSource}
          className="size-8"
        >
          <ChevronLeftIcon className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Move all to ${titles[0]}`}
          disabled={
            disabled || targetItems.filter((i) => !i.disabled).length === 0
          }
          onClick={handleMoveAllToSource}
          className="size-8"
        >
          <ChevronsLeftIcon className="size-4" />
        </Button>
      </div>

      {renderListPanel(
        "target",
        titles[1],
        filteredTargetItems,
        checkedTargetIds,
        targetQuery,
        setTargetQuery,
        handleToggleAllTarget,
        isAllTargetChecked,
        isSomeTargetChecked
      )}

      <span aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </div>
  )
}
