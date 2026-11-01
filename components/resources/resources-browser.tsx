"use client"

import type { ReactNode } from "react"

import { EmptyResults } from "@/components/docs/empty-results"
import { SearchField } from "@/components/docs/search-field"
import { SegmentedControl } from "@/components/docs/segmented-control"
import { useUrlFilters } from "@/lib/use-url-filters"

export type ResourceListing = {
  slug: string
  tags: readonly string[]
  searchText: string
  row: ReactNode
}

type Filters = { query: string; tag: string }

const ALL = "all"

function parseFilters(search: string, tags: readonly string[]): Filters {
  const params = new URLSearchParams(search)
  const tag = params.get("tag")

  return {
    query: params.get("q") ?? "",
    tag: tag && tags.includes(tag) ? tag : ALL,
  }
}

function filtersToParams({ query, tag }: Filters) {
  const params = new URLSearchParams()
  if (query) params.set("q", query)
  if (tag !== ALL) params.set("tag", tag)

  return params
}

export function ResourcesBrowser({
  tags,
  feature,
  listings,
}: {
  tags: readonly string[]
  feature: ReactNode
  listings: ResourceListing[]
}) {
  const [filters, setFilters] = useUrlFilters(
    (search) => parseFilters(search, tags),
    filtersToParams
  )
  const { query, tag: activeTag } = filters

  const normalizedQuery = query.trim().toLowerCase()
  const searched = listings.filter(({ searchText }) =>
    searchText.includes(normalizedQuery)
  )
  const matches = searched.filter(
    (listing) => activeTag === ALL || listing.tags.includes(activeTag)
  )
  const isFiltering = Boolean(normalizedQuery) || activeTag !== ALL

  const filterItems = [ALL, ...tags].map((tag) => ({
    value: tag,
    label: (
      <>
        {tag === ALL ? "All" : tag}
        <span className="hidden font-mono text-[11px] text-muted-foreground tabular-nums sm:inline">
          {tag === ALL
            ? searched.length
            : searched.filter((listing) => listing.tags.includes(tag)).length}
        </span>
      </>
    ),
  }))

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchField
          value={query}
          onValueChange={(next) => setFilters({ ...filters, query: next })}
          label="Search posts"
          className="lg:w-72 lg:shrink-0"
        />
        <SegmentedControl
          items={filterItems}
          value={activeTag}
          onValueChange={(next) => setFilters({ ...filters, tag: next })}
          label="Filter by tag"
          className="-mx-1 min-w-0 [scrollbar-width:none] overflow-x-auto px-1"
        />
      </div>
      <p role="status" className="sr-only">
        {matches.length === 1 ? "1 post" : `${matches.length} posts`}
      </p>
      {matches.length === 0 ? (
        <EmptyResults
          query={query}
          onReset={() => setFilters({ query: "", tag: ALL })}
          hint="Try a topic, like “students” or “accessibility”."
          resetLabel="Show all posts"
        />
      ) : (
        <>
          {!isFiltering && feature}
          <ul className="flex flex-col border-t">
            {(isFiltering ? matches : matches.slice(1)).map(({ slug, row }) => (
              <li key={slug} className="border-b">
                {row}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
