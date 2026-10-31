import { readdirSync } from "node:fs"
import { describe, expect, it } from "vitest"

import { CATALOG } from "@/lib/catalog"
import { loadExamples } from "@/lib/component-docs"

const FOLDERS = readdirSync("components/preview/examples")

describe("component examples", () => {
  it.each(FOLDERS)("%s is named after a catalog component", (folder) => {
    expect(CATALOG.map((entry) => entry.slug)).toContain(folder)
  })

  it.each(FOLDERS)("%s loads every listed example", async (slug) => {
    const examples = await loadExamples(slug, "radix")

    expect(examples.length).toBeGreaterThan(0)
    expect(new Set(examples.map(({ id }) => id)).size).toBe(examples.length)
    for (const { id, usage } of examples) {
      expect(id.startsWith(`${slug}-`)).toBe(true)
      expect(usage.code).toContain("Demo")
    }
  })

  it("returns nothing for a component without examples", async () => {
    await expect(loadExamples("multi-select", "base")).resolves.toEqual([])
  })
})
