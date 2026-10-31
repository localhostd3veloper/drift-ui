import { readdirSync } from "node:fs"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { CATALOG } from "@/lib/catalog"
import type { ComponentExample } from "@/lib/component-docs"

const FOLDERS = readdirSync("components/preview/examples")

const EXAMPLES = (
  await Promise.all(
    FOLDERS.map(async (slug) => {
      const { examples }: { examples: ComponentExample[] } = await import(
        `@/components/preview/examples/${slug}/index.ts`
      )

      return examples.map((example): [string, ComponentExample] => [
        `${slug}/${example.id}`,
        example,
      ])
    })
  )
).flat()

describe("component examples", () => {
  it("covers every catalog component", () => {
    expect([...FOLDERS].sort()).toEqual(
      CATALOG.map((entry) => entry.slug).sort()
    )
  })

  it.each(EXAMPLES)("%s renders", (_, { Preview, BasePreview }) => {
    const Example =
      (process.env.UI_PRIMITIVES === "base" && BasePreview) || Preview
    const { container } = render(<Example />)

    expect(container).not.toBeEmptyDOMElement()
  })
})
