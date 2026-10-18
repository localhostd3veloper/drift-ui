"use client"

import { useState } from "react"

import { CardGroup } from "@/components/docs/card-group"
import type { CatalogCard } from "@/components/docs/component-card"
import { EmptyResults } from "@/components/docs/empty-results"
import { SearchField } from "@/components/docs/search-field"
import { SegmentedControl } from "@/components/docs/segmented-control"
import type { CATEGORIES } from "@/lib/catalog"

type Category = (typeof CATEGORIES)[number]

const ALL = "all"

function matchesQuery(card: CatalogCard, query: string) {
  if (!query) return true

  return [card.name, card.slug, card.description]
    .join(" ")
    .toLowerCase()
    .includes(query)
}

export function ComponentsBrowser({
  categories,
  cards,
}: {
  categories: Category[]
  cards: CatalogCard[]
}) {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>(ALL)

  const normalizedQuery = query.trim().toLowerCase()
  const searched = cards.filter((card) => matchesQuery(card, normalizedQuery))
  const groups = categories
    .filter(({ id }) => activeCategory === ALL || id === activeCategory)
    .map((category) => ({
      ...category,
      cards: searched.filter((card) => card.category === category.id),
    }))
    .filter((group) => group.cards.length > 0)

  const filterItems = [{ id: ALL, label: "All" }, ...categories].map(
    ({ id, label }) => ({
      value: id,
      label: (
        <>
          {label}
          <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
            {id === ALL
              ? searched.length
              : searched.filter((card) => card.category === id).length}
          </span>
        </>
      ),
    })
  )

  function resetFilters() {
    setQuery("")
    setActiveCategory(ALL)
  }

  return (
    <div className="flex flex-col gap-14">
      <div className="sticky top-28 z-20 -mx-4 flex flex-col gap-3 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur-md md:-mx-10 md:px-10 lg:top-16 lg:mx-0 lg:flex-row lg:items-center lg:px-0">
        <SearchField
          value={query}
          onValueChange={setQuery}
          className="lg:w-72"
        />
        <SegmentedControl
          items={filterItems}
          value={activeCategory}
          onValueChange={setActiveCategory}
          label="Filter by category"
          className="-mx-1 [scrollbar-width:none] overflow-x-auto px-1"
        />
      </div>
      {groups.length === 0 ? (
        <EmptyResults query={query} onReset={resetFilters} />
      ) : (
        <div className="flex flex-col gap-20">
          {groups.map((group) => (
            <CardGroup
              key={group.id}
              id={group.id}
              label={group.label}
              description={group.description}
              cards={group.cards}
            />
          ))}
        </div>
      )}
    </div>
  )
}
