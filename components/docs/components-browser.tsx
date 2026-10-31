"use client"

import { useEffect, useState, useSyncExternalStore } from "react"

import { CardGroup } from "@/components/docs/card-group"
import type { CatalogCard } from "@/components/docs/component-card"
import { EmptyResults } from "@/components/docs/empty-results"
import { SearchField } from "@/components/docs/search-field"
import { SegmentedControl } from "@/components/docs/segmented-control"
import type { CATEGORIES } from "@/lib/catalog"

type Category = (typeof CATEGORIES)[number]

const ALL = "all"
const URL_SYNC_DELAY_MS = 250

function matchesQuery(card: CatalogCard, query: string) {
  if (!query) return true

  return [card.name, card.slug, card.description]
    .join(" ")
    .toLowerCase()
    .includes(query)
}

type Filters = { query: string; category: string }

function parseFilters(search: string, categories: Category[]): Filters {
  const params = new URLSearchParams(search)
  const category = params.get("category")

  return {
    query: params.get("q") ?? "",
    category: categories.find(({ id }) => id === category)?.id ?? ALL,
  }
}

function filtersUrl({ query, category }: Filters) {
  const params = new URLSearchParams()
  if (query) params.set("q", query)
  if (category !== ALL) params.set("category", category)

  return `${window.location.pathname}${params.size > 0 ? `?${params}` : ""}`
}

function subscribeToNothing() {
  return () => {}
}

function useLocationSearch() {
  return useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => ""
  )
}

export function ComponentsBrowser({
  categories,
  cards,
}: {
  categories: Category[]
  cards: CatalogCard[]
}) {
  const search = useLocationSearch()
  const [edited, setEdited] = useState<Filters | null>(null)
  const filters = edited ?? parseFilters(search, categories)
  const { query, category: activeCategory } = filters

  useEffect(() => {
    if (!edited) return

    const timeout = setTimeout(() => {
      window.history.replaceState(null, "", filtersUrl(edited))
    }, URL_SYNC_DELAY_MS)

    return () => clearTimeout(timeout)
  }, [edited])

  const normalizedQuery = query.trim().toLowerCase()
  const searched = cards.filter((card) => matchesQuery(card, normalizedQuery))
  const visibleSlugs = new Set(
    searched
      .filter(
        (card) => activeCategory === ALL || card.category === activeCategory
      )
      .map((card) => card.slug)
  )

  const filterItems = [{ id: ALL, label: "All" }, ...categories].map(
    ({ id, label }) => ({
      value: id,
      label: (
        <>
          {label}
          <span className="hidden font-mono text-[11px] text-muted-foreground tabular-nums sm:inline">
            {id === ALL
              ? searched.length
              : searched.filter((card) => card.category === id).length}
          </span>
        </>
      ),
    })
  )

  function resetFilters() {
    setEdited({ query: "", category: ALL })
  }

  return (
    <div className="flex flex-col">
      <div className="contents lg:sticky lg:top-16 lg:z-20 lg:flex lg:items-center lg:gap-3 lg:border-b lg:border-border/60 lg:bg-background/80 lg:py-3 lg:backdrop-blur-md">
        <SearchField
          value={query}
          onValueChange={(next) => setEdited({ ...filters, query: next })}
          className="lg:w-72"
        />
        <div className="sticky top-16 z-20 -mx-4 mt-1 border-b border-border/60 bg-background/80 px-4 py-2 backdrop-blur-md md:-mx-10 md:px-10 lg:static lg:mx-0 lg:mt-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <SegmentedControl
            items={filterItems}
            value={activeCategory}
            onValueChange={(next) => setEdited({ ...filters, category: next })}
            label="Filter by category"
            className="-mx-1 [scrollbar-width:none] overflow-x-auto px-1 max-sm:justify-between max-sm:[&>button]:px-2"
          />
        </div>
      </div>
      <p role="status" className="sr-only">
        {visibleSlugs.size === 1
          ? "1 component"
          : `${visibleSlugs.size} components`}
      </p>
      {visibleSlugs.size === 0 && (
        <div className="mt-8">
          <EmptyResults query={query} onReset={resetFilters} />
        </div>
      )}
      <div className="mt-8 flex flex-col gap-12">
        {categories.map((category) => (
          <CardGroup
            key={category.id}
            id={category.id}
            label={category.label}
            description={category.description}
            cards={cards.filter((card) => card.category === category.id)}
            visibleSlugs={visibleSlugs}
          />
        ))}
      </div>
    </div>
  )
}
