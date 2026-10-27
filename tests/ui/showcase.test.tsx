import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ShowcaseCanvas } from "@/components/showcase/showcase-canvas"
import {
  SHOWCASE_CARDS,
  UNSHOWCASED_ENTRIES,
} from "@/components/showcase/showcase-cards"
import { CATALOG } from "@/lib/catalog"

const CATALOG_SLUGS = new Set(CATALOG.map((entry) => entry.slug))

describe("Showcase", () => {
  it("only lists catalog slugs as the components a card uses", () => {
    const unknownSlugs = SHOWCASE_CARDS.flatMap((card) => card.uses).filter(
      (slug) => !CATALOG_SLUGS.has(slug)
    )

    expect(unknownSlugs).toEqual([])
  })

  it("puts every catalog component on the canvas", () => {
    render(<ShowcaseCanvas />)

    for (const entry of UNSHOWCASED_ENTRIES) {
      expect(screen.getByRole("link", { name: entry.name })).toBeVisible()
    }
    expect(UNSHOWCASED_ENTRIES.length + SHOWCASE_CARDS.length).toBeGreaterThan(
      0
    )
  })
})
