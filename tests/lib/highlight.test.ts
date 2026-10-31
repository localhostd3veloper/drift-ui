import { describe, expect, it } from "vitest"

import { highlightInline, highlightType } from "@/lib/highlight"

function tokenColors(html: string) {
  return [...html.matchAll(/--shiki-dark:([^;"]+)/g)].map(([, color]) => color)
}

describe("inline highlighting", () => {
  it("returns spans without a block wrapper", async () => {
    const html = await highlightInline('"split"')

    expect(html).toContain("<span")
    expect(html).not.toContain("<pre")
  })

  it("escapes markup", async () => {
    const html = await highlightInline("<StarIcon />")

    expect(html).not.toContain("<StarIcon")
  })

  it("reads a bare primitive as a type", async () => {
    const [asType] = tokenColors(await highlightType("string"))
    const [asValue] = tokenColors(await highlightInline("string"))

    expect(asType).toBeDefined()
    expect(asType).not.toBe(asValue)
  })

  it("colors the parts of a union differently", async () => {
    const colors = tokenColors(await highlightType('"split" | "unified"'))

    expect(new Set(colors).size).toBeGreaterThan(1)
  })
})
