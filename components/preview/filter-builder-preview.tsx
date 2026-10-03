"use client"

import * as React from "react"
import { CircleDotIcon, HashIcon, TextIcon } from "lucide-react"

import {
  matchesFilter,
  type Filter,
  type FilterField,
} from "@/registry/default/lib/filter"
import { FilterBuilder } from "@/registry/default/ui/filter-builder"

const FIELDS: FilterField[] = [
  {
    id: "status",
    label: "Status",
    type: "select",
    icon: <CircleDotIcon />,
    options: [
      { value: "open", label: "Open" },
      { value: "in-review", label: "In review" },
      { value: "closed", label: "Closed" },
    ],
  },
  { id: "title", label: "Title", type: "text", icon: <TextIcon /> },
  { id: "points", label: "Points", type: "number", icon: <HashIcon /> },
]

const ISSUES = [
  {
    id: "MY-104",
    title: "Invoice totals round twice",
    status: "open",
    points: 3,
  },
  {
    id: "MY-112",
    title: "Dark mode chart contrast",
    status: "in-review",
    points: 2,
  },
  {
    id: "MY-118",
    title: "Invoice PDF missing logo",
    status: "closed",
    points: 1,
  },
  {
    id: "MY-121",
    title: "Retry webhook deliveries",
    status: "open",
    points: 5,
  },
]

type Issue = (typeof ISSUES)[number]

function matchesAllFilters(issue: Issue, filters: Filter[]) {
  return filters.every((filter) =>
    matchesFilter(issue[filter.fieldId as keyof Issue], filter)
  )
}

export function FilterBuilderPreview() {
  const [filters, setFilters] = React.useState<Filter[]>([])
  const visibleIssues = ISSUES.filter((issue) =>
    matchesAllFilters(issue, filters)
  )

  return (
    <>
      <FilterBuilder
        fields={FIELDS}
        value={filters}
        onValueChange={setFilters}
      />
      <ul className="divide-y rounded-md border text-sm">
        {visibleIssues.map((issue) => (
          <li key={issue.id} className="flex items-center gap-3 px-3 py-2">
            <span className="font-mono text-xs text-muted-foreground">
              {issue.id}
            </span>
            <span className="flex-1 truncate">{issue.title}</span>
            <span className="font-mono text-xs text-muted-foreground">
              {issue.points} pts
            </span>
          </li>
        ))}
        {visibleIssues.length === 0 && (
          <li className="px-3 py-6 text-center text-muted-foreground">
            No issues match these filters.
          </li>
        )}
      </ul>
    </>
  )
}
