"use client"

import * as React from "react"
import { ChevronRightIcon, LoaderIcon } from "lucide-react"

import { cn } from "@/registry/default/lib/utils"

type TreeNode = {
  id: string
  label: React.ReactNode
  textValue?: string
  icon?: React.ReactNode
  children?: TreeNode[]
  isBranch?: boolean
  disabled?: boolean
}

type VisibleNode = {
  node: TreeNode
  depth: number
  parentId: string | null
  isBranch: boolean
  position: number
  siblingCount: number
}

const TYPEAHEAD_RESET_MS = 500

function flattenVisible(
  nodes: TreeNode[],
  expanded: string[],
  depth = 0,
  parentId: string | null = null
): VisibleNode[] {
  return nodes.flatMap((node, index) => {
    const isBranch = node.isBranch ?? node.children !== undefined
    const row = {
      node,
      depth,
      parentId,
      isBranch,
      position: index + 1,
      siblingCount: nodes.length,
    }
    if (!isBranch || !expanded.includes(node.id) || !node.children) return [row]
    return [row, ...flattenVisible(node.children, expanded, depth + 1, node.id)]
  })
}

function textOf(node: TreeNode) {
  return (
    node.textValue ?? (typeof node.label === "string" ? node.label : "")
  ).toLowerCase()
}

function TreeView({
  items,
  expanded,
  defaultExpanded = [],
  onExpandedChange,
  selected,
  defaultSelected = null,
  onSelectedChange,
  className,
  ...props
}: Omit<React.ComponentProps<"ul">, "children"> & {
  items: TreeNode[]
  expanded?: string[]
  defaultExpanded?: string[]
  onExpandedChange?: (expanded: string[]) => void
  selected?: string | null
  defaultSelected?: string | null
  onSelectedChange?: (id: string) => void
}) {
  const [uncontrolledExpanded, setUncontrolledExpanded] =
    React.useState(defaultExpanded)
  const [uncontrolledSelected, setUncontrolledSelected] =
    React.useState(defaultSelected)
  const [focusedId, setFocusedId] = React.useState<string | null>(null)
  const itemRefs = React.useRef(new Map<string, HTMLLIElement>())
  const typeahead = React.useRef({ query: "", lastKeyAt: 0 })
  const expandedIds = expanded ?? uncontrolledExpanded
  const selectedId = selected !== undefined ? selected : uncontrolledSelected
  const visible = flattenVisible(items, expandedIds)
  const tabStopId = visible.some((row) => row.node.id === focusedId)
    ? focusedId
    : (selectedId ?? visible[0]?.node.id)

  function setExpanded(next: string[]) {
    if (expanded === undefined) setUncontrolledExpanded(next)
    onExpandedChange?.(next)
  }

  function toggle(id: string, shouldExpand = !expandedIds.includes(id)) {
    if (shouldExpand === expandedIds.includes(id)) return
    setExpanded(
      shouldExpand
        ? [...expandedIds, id]
        : expandedIds.filter((expandedId) => expandedId !== id)
    )
  }

  function select(id: string) {
    if (selected === undefined) setUncontrolledSelected(id)
    onSelectedChange?.(id)
  }

  function focusNode(id: string | undefined) {
    if (!id) return
    setFocusedId(id)
    itemRefs.current.get(id)?.focus()
  }

  function focusByTypeahead(
    key: string,
    fromIndex: number,
    keyPressedAtMs: number
  ) {
    const state = typeahead.current
    state.query =
      keyPressedAtMs - state.lastKeyAt > TYPEAHEAD_RESET_MS
        ? key
        : state.query + key
    state.lastKeyAt = keyPressedAtMs
    const searchStart = state.query.length > 1 ? fromIndex : fromIndex + 1
    const ordered = [
      ...visible.slice(searchStart),
      ...visible.slice(0, searchStart),
    ]
    focusNode(
      ordered.find((row) => textOf(row.node).startsWith(state.query))?.node.id
    )
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLLIElement>,
    index: number
  ) {
    const row = visible[index]
    const isExpanded = expandedIds.includes(row.node.id)

    switch (event.key) {
      case "ArrowDown":
        focusNode(visible[index + 1]?.node.id)
        break
      case "ArrowUp":
        focusNode(visible[index - 1]?.node.id)
        break
      case "ArrowRight":
        if (!row.isBranch) return
        if (!isExpanded) toggle(row.node.id, true)
        else focusNode(row.node.children?.[0]?.id)
        break
      case "ArrowLeft":
        if (row.isBranch && isExpanded) toggle(row.node.id, false)
        else focusNode(row.parentId ?? undefined)
        break
      case "Home":
        focusNode(visible[0]?.node.id)
        break
      case "End":
        focusNode(visible.at(-1)?.node.id)
        break
      case "Enter":
      case " ":
        if (row.node.disabled) return
        select(row.node.id)
        if (row.isBranch && event.key === "Enter") toggle(row.node.id)
        break
      default:
        if (
          event.key.length !== 1 ||
          event.metaKey ||
          event.ctrlKey ||
          event.altKey
        )
          return
        focusByTypeahead(event.key.toLowerCase(), index, event.timeStamp)
    }
    event.preventDefault()
  }

  return (
    <ul
      role="tree"
      data-slot="tree-view"
      className={cn("flex flex-col gap-px text-sm", className)}
      {...props}
    >
      {visible.map((row, index) => {
        const isExpanded = row.isBranch && expandedIds.includes(row.node.id)
        const isLoading = isExpanded && row.node.children === undefined

        return (
          <React.Fragment key={row.node.id}>
            <li
              ref={(element) => {
                if (element) itemRefs.current.set(row.node.id, element)
                else itemRefs.current.delete(row.node.id)
              }}
              role="treeitem"
              data-slot="tree-view-item"
              aria-level={row.depth + 1}
              aria-posinset={row.position}
              aria-setsize={row.siblingCount}
              aria-expanded={row.isBranch ? isExpanded : undefined}
              aria-selected={selectedId === row.node.id}
              aria-disabled={row.node.disabled || undefined}
              tabIndex={tabStopId === row.node.id ? 0 : -1}
              onFocus={() => setFocusedId(row.node.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              onClick={() => {
                if (row.node.disabled) return
                select(row.node.id)
                if (row.isBranch) toggle(row.node.id)
              }}
              style={{ paddingLeft: `calc(${row.depth} * 1rem + 0.5rem)` }}
              className={cn(
                "flex h-8 cursor-default items-center gap-1.5 rounded-md pr-2 outline-none select-none",
                "hover:bg-accent/60 focus-visible:ring-[3px] focus-visible:ring-ring/50",
                "aria-selected:bg-accent aria-selected:font-medium aria-selected:text-accent-foreground",
                "aria-disabled:pointer-events-none aria-disabled:opacity-50",
                "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground"
              )}
            >
              {row.isBranch ? (
                <ChevronRightIcon
                  className={cn(
                    "transition-transform duration-200",
                    isExpanded && "rotate-90"
                  )}
                />
              ) : (
                <span className="size-4 shrink-0" />
              )}
              {row.node.icon}
              <span className="truncate">{row.node.label}</span>
            </li>
            {isLoading && (
              <li
                role="none"
                style={{
                  paddingLeft: `calc(${row.depth + 1} * 1rem + 0.5rem)`,
                }}
                className="flex h-8 items-center gap-1.5 text-muted-foreground [&_svg]:size-4"
              >
                <LoaderIcon className="animate-spin" />
                Loading
              </li>
            )}
          </React.Fragment>
        )
      })}
    </ul>
  )
}

export { TreeView, type TreeNode }
