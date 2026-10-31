import { describe, expect, it } from "vitest"

import { scoreSearchEntry } from "@/lib/docs-search"
import { CATALOG } from "@/lib/catalog"

function rank(search: string) {
  return CATALOG.map((entry) => ({
    slug: entry.slug,
    score: scoreSearchEntry(entry.name, search, [
      entry.slug,
      entry.description,
    ]),
  }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ slug }) => slug)
}

describe("scoreSearchEntry", () => {
  it("puts a name match first", () => {
    expect(rank("stepper")[0]).toBe("stepper")
  })

  it("finds a component from its description", () => {
    expect(rank("upload")).toEqual(["file-dropzone"])
  })

  it("forgives a typo in the name", () => {
    expect(rank("steper")[0]).toBe("stepper")
  })

  it("ignores letters scattered through other names", () => {
    expect(rank("tree")).toEqual(["tree-view"])
  })

  it("does not fuzzy match descriptions", () => {
    expect(rank("zzzz")).toEqual([])
  })

  it("ranks a name above a description", () => {
    expect(scoreSearchEntry("Rating", "rating", [])).toBeGreaterThan(
      scoreSearchEntry("Timeline", "rating", ["a rating of events"])
    )
  })
})
