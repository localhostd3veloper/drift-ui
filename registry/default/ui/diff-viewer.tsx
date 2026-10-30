"use client"

import * as React from "react"
import { ChevronRightIcon } from "lucide-react"

import {
  collapseUnchanged,
  diffLines,
  pairLines,
  type DiffLine,
} from "@/registry/default/lib/diff"
import { cn } from "@/registry/default/lib/utils"

type DiffMode = "split" | "unified"

const NUMBER_CLASS =
  "px-2 py-0.5 text-right align-top text-muted-foreground tabular-nums select-none"

const LINE_CLASSES: Record<DiffLine["type"], string> = {
  equal: "",
  add: "bg-[color-mix(in_oklab,var(--chart-2)_15%,transparent)]",
  remove: "bg-destructive/10",
}

const SIGNS: Record<DiffLine["type"], string> = {
  equal: " ",
  add: "+",
  remove: "-",
}

const SCREEN_READER_LABELS: Record<DiffLine["type"], string> = {
  equal: "",
  add: "Added: ",
  remove: "Removed: ",
}

function lineCount(count: number) {
  return `${count} ${count === 1 ? "line" : "lines"}`
}

function LineText({ line }: { line: DiffLine }) {
  if (!line.segments) return line.text

  const Changed = line.type === "add" ? "ins" : "del"
  return line.segments.map((segment, index) =>
    segment.changed ? (
      <Changed
        key={index}
        className={cn(
          "rounded-sm no-underline",
          line.type === "add"
            ? "bg-[color-mix(in_oklab,var(--chart-2)_35%,transparent)]"
            : "bg-destructive/25"
        )}
      >
        {segment.text}
      </Changed>
    ) : (
      segment.text
    )
  )
}

function LineCell({ line, className }: { line: DiffLine; className?: string }) {
  return (
    <td
      className={cn(
        "px-2 py-0.5 align-top wrap-anywhere whitespace-pre-wrap",
        className
      )}
    >
      <span aria-hidden className="mr-2 text-muted-foreground select-none">
        {SIGNS[line.type]}
      </span>
      <span className="sr-only">{SCREEN_READER_LABELS[line.type]}</span>
      <LineText line={line} />
    </td>
  )
}

function SplitSide({ line }: { line: DiffLine | null }) {
  if (!line) {
    return <td colSpan={2} className="bg-muted/50" />
  }
  return (
    <>
      <td className={cn(NUMBER_CLASS, LINE_CLASSES[line.type])}>
        {line.oldNumber ?? line.newNumber}
      </td>
      <LineCell line={line} className={LINE_CLASSES[line.type]} />
    </>
  )
}

function SplitRows({ lines }: { lines: DiffLine[] }) {
  return pairLines(lines).map((pair) => (
    <tr key={`${pair.old?.oldNumber}:${pair.new?.newNumber}`}>
      <SplitSide line={pair.old} />
      <SplitSide line={pair.new} />
    </tr>
  ))
}

function UnifiedRows({ lines }: { lines: DiffLine[] }) {
  return lines.map((line) => (
    <tr
      key={`${line.oldNumber}:${line.newNumber}`}
      className={LINE_CLASSES[line.type]}
    >
      <td className={NUMBER_CLASS}>{line.oldNumber}</td>
      <td className={NUMBER_CLASS}>{line.newNumber}</td>
      <LineCell line={line} />
    </tr>
  ))
}

function DiffViewer({
  oldValue,
  newValue,
  mode = "split",
  contextLines = 3,
  className,
  "aria-label": ariaLabel = "Diff",
  ...props
}: React.ComponentProps<"div"> & {
  oldValue: string
  newValue: string
  mode?: DiffMode
  contextLines?: number
}) {
  const lines = React.useMemo(
    () => diffLines(oldValue, newValue),
    [oldValue, newValue]
  )
  const blocks = React.useMemo(
    () => collapseUnchanged(lines, contextLines),
    [lines, contextLines]
  )
  const [expandedIds, setExpandedIds] = React.useState<number[]>([])
  const [expandedFor, setExpandedFor] = React.useState(lines)
  if (expandedFor !== lines) {
    setExpandedFor(lines)
    setExpandedIds([])
  }

  const addedCount = lines.filter((line) => line.type === "add").length
  const removedCount = lines.filter((line) => line.type === "remove").length
  const columnCount = mode === "split" ? 4 : 3
  const Rows = mode === "split" ? SplitRows : UnifiedRows

  function toggle(id: number) {
    setExpandedIds((current) =>
      current.includes(id)
        ? current.filter((expandedId) => expandedId !== id)
        : [...current, id]
    )
  }

  return (
    <div
      data-slot="diff-viewer"
      data-mode={mode}
      className={cn(
        "overflow-auto rounded-lg border font-mono text-xs",
        className
      )}
      {...props}
    >
      <table aria-label={ariaLabel} className="w-full table-fixed">
        <caption className="sr-only">
          {addedCount === 0 && removedCount === 0
            ? "No changes"
            : `${lineCount(addedCount)} added, ${lineCount(removedCount)} removed`}
        </caption>
        <colgroup>
          {mode === "split" ? (
            <>
              <col className="w-12" />
              <col />
              <col className="w-12" />
              <col />
            </>
          ) : (
            <>
              <col className="w-12" />
              <col className="w-12" />
              <col />
            </>
          )}
        </colgroup>
        <thead className="sr-only">
          <tr>
            {mode === "split" ? (
              <>
                <th scope="col">Old line number</th>
                <th scope="col">Old content</th>
                <th scope="col">New line number</th>
                <th scope="col">New content</th>
              </>
            ) : (
              <>
                <th scope="col">Old line number</th>
                <th scope="col">New line number</th>
                <th scope="col">Content</th>
              </>
            )}
          </tr>
        </thead>
        {blocks.map((block, index) => {
          if (block.kind === "lines") {
            return (
              <tbody key={`lines-${index}`}>
                <Rows lines={block.lines} />
              </tbody>
            )
          }

          const isExpanded = expandedIds.includes(block.id)
          return (
            <tbody key={`unchanged-${block.id}`}>
              <tr>
                <td colSpan={columnCount} className="bg-muted/50">
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() => toggle(block.id)}
                    className="flex w-full items-center gap-1.5 px-2 py-1 text-left font-sans text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset"
                  >
                    <ChevronRightIcon
                      className={cn(
                        "size-3.5 transition-transform duration-200",
                        isExpanded && "rotate-90"
                      )}
                    />
                    {isExpanded ? "Hide" : "Show"} {block.lines.length}{" "}
                    unchanged lines
                  </button>
                </td>
              </tr>
              {isExpanded && <Rows lines={block.lines} />}
            </tbody>
          )
        })}
      </table>
    </div>
  )
}

export { DiffViewer, type DiffMode }
