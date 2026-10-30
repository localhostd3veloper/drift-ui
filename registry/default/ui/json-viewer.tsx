"use client"

import * as React from "react"
import { CheckIcon, CopyIcon, RouteIcon } from "lucide-react"

import { useCopyToClipboard } from "@/registry/default/hooks/use-copy-to-clipboard"
import {
  childEntries,
  expandedToDepth,
  formatValue,
  rootEntries,
  searchJson,
  sizeOf,
  type JsonEntry,
} from "@/registry/default/lib/json-viewer"
import { cn } from "@/registry/default/lib/utils"
import { Input } from "@/registry/default/ui/input"
import { TreeView, type TreeNode } from "@/registry/default/ui/tree-view"

type CopyTarget = "value" | "path"

const TYPE_CLASSES: Record<string, string> = {
  string: "text-[color-mix(in_oklab,var(--chart-2)_65%,var(--foreground))]",
  number: "text-[color-mix(in_oklab,var(--chart-1)_65%,var(--foreground))]",
  boolean: "text-[color-mix(in_oklab,var(--chart-3)_65%,var(--foreground))]",
  object: "text-muted-foreground italic",
}

function Highlight({ text, query }: { text: string; query: string }) {
  const index = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1
  if (index === -1) return text

  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded-sm bg-chart-4/40 text-inherit">
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  )
}

function ValueText({ value, query }: { value: unknown; query: string }) {
  if (Array.isArray(value)) {
    return (
      <span className="text-muted-foreground">
        {value.length === 0 ? "[]" : `Array(${value.length})`}
      </span>
    )
  }
  if (typeof value === "object" && value !== null) {
    return (
      <span className="text-muted-foreground">
        {sizeOf(value) === 0 ? "{}" : "{…}"}
      </span>
    )
  }

  const text = String(value)
  return (
    <span className={TYPE_CLASSES[typeof value]}>
      {typeof value === "string" ? (
        <>
          &quot;
          <Highlight text={text} query={query} />
          &quot;
        </>
      ) : (
        <Highlight text={text} query={query} />
      )}
    </span>
  )
}

function JsonViewer({
  data,
  defaultExpandDepth = 1,
  onCopy,
  className,
  "aria-label": ariaLabel = "JSON",
  ...props
}: Omit<React.ComponentProps<"div">, "onCopy"> & {
  data: unknown
  defaultExpandDepth?: number
  onCopy?: (path: string, value: unknown, target: CopyTarget) => void
}) {
  const [expanded, setExpanded] = React.useState(() =>
    expandedToDepth(data, defaultExpandDepth)
  )
  const [expandedBeforeSearch, setExpandedBeforeSearch] = React.useState<
    string[] | null
  >(null)
  const [query, setQuery] = React.useState("")
  const { copied, copy } = useCopyToClipboard()
  const needle = query.trim()
  const { matches } = React.useMemo(
    () => searchJson(data, needle),
    [data, needle]
  )
  const expandedIds = new Set(expanded)
  const entriesById = new Map<string, JsonEntry>()

  function copyEntry(entry: JsonEntry, target: CopyTarget) {
    const text = target === "value" ? formatValue(entry.value) : entry.path
    copy(text, `${target}:${entry.id}`).then(() =>
      onCopy?.(entry.path, entry.value, target)
    )
  }

  function search(next: string) {
    setQuery(next)
    const base = expandedBeforeSearch ?? expanded
    const { ancestors } = searchJson(data, next)
    setExpandedBeforeSearch(next.trim() ? base : null)
    setExpanded([...new Set([...base, ...ancestors])])
  }

  function renderRow(entry: JsonEntry) {
    if (entry.range) {
      return (
        <span
          data-json-id={entry.id}
          className="font-mono text-xs text-muted-foreground"
        >
          [{entry.range[0]} … {entry.range[1]}]
        </span>
      )
    }

    return (
      <span
        data-json-id={entry.id}
        className="inline-flex min-w-0 items-center gap-1.5 font-mono text-xs"
      >
        {entry.key !== null && (
          <span
            className={
              typeof entry.key === "number"
                ? "text-muted-foreground"
                : "text-foreground"
            }
          >
            <Highlight
              text={String(entry.key)}
              query={typeof entry.key === "string" ? needle : ""}
            />
            :
          </span>
        )}
        <ValueText value={entry.value} query={needle} />
        <span
          aria-hidden
          className="inline-flex opacity-0 transition-opacity pointer-coarse:opacity-100 [[role=treeitem]:focus-visible_&]:opacity-100 [[role=treeitem]:hover_&]:opacity-100"
        >
          {(["value", "path"] as const).map((target) => (
            <button
              key={target}
              type="button"
              tabIndex={-1}
              aria-label={`Copy ${target}`}
              onClick={(event) => {
                event.stopPropagation()
                copyEntry(entry, target)
              }}
              className="inline-flex size-6 items-center justify-center rounded-sm hover:bg-background"
            >
              {copied === `${target}:${entry.id}` ? (
                <CheckIcon />
              ) : target === "value" ? (
                <CopyIcon />
              ) : (
                <RouteIcon />
              )}
            </button>
          ))}
        </span>
      </span>
    )
  }

  function toNodes(entries: JsonEntry[]): TreeNode[] {
    return entries.map((entry) => {
      entriesById.set(entry.id, entry)
      return {
        id: entry.id,
        label: renderRow(entry),
        textValue: entry.key === null ? "" : String(entry.key),
        isBranch: entry.isBranch,
        children:
          entry.isBranch && expandedIds.has(entry.id)
            ? toNodes(childEntries(entry.value, entry.path, entry.range))
            : undefined,
      }
    })
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLUListElement>) {
    if (event.key.toLowerCase() !== "c") return
    if (!(event.metaKey || event.ctrlKey)) return
    if (window.getSelection()?.toString()) return
    const id = (event.target as HTMLElement).querySelector<HTMLElement>(
      "[data-json-id]"
    )?.dataset.jsonId
    const entry = id ? entriesById.get(id) : undefined
    if (!entry || entry.range) return
    event.preventDefault()
    copyEntry(entry, event.shiftKey ? "path" : "value")
  }

  return (
    <div
      data-slot="json-viewer"
      className={cn("flex flex-col gap-2 rounded-lg border p-2", className)}
      {...props}
    >
      <div className="flex items-center gap-2">
        <Input
          type="search"
          aria-label="Search keys and values"
          placeholder="Search keys and values"
          value={query}
          onChange={(event) => search(event.target.value)}
          className="h-8"
        />
        <span role="status" className="shrink-0 text-xs text-muted-foreground">
          {needle &&
            `${matches.size} ${matches.size === 1 ? "match" : "matches"}`}
        </span>
      </div>
      <TreeView
        aria-label={ariaLabel}
        items={toNodes(rootEntries(data))}
        expanded={expanded}
        onExpandedChange={setExpanded}
        onKeyDown={handleKeyDown}
        className="overflow-auto"
      />
      <span role="status" className="sr-only">
        {copied ? `Copied ${copied.slice(0, copied.indexOf(":"))}` : ""}
      </span>
    </div>
  )
}

export { JsonViewer }
