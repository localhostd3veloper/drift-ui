import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

import { COMPONENT_API } from "@/lib/agent-docs/component-api"
import { CATALOG } from "@/lib/catalog"

describe("component API reference", () => {
  it.each(CATALOG.map((entry) => entry.slug))("%s has one", (slug) => {
    expect(COMPONENT_API[slug]?.length).toBeGreaterThan(0)
  })

  it.each(Object.entries(COMPONENT_API))(
    "%s only documents props its source declares",
    (slug, parts) => {
      const entry = CATALOG.find((catalogEntry) => catalogEntry.slug === slug)
      const source = (entry?.files ?? [])
        .map((file) => readFileSync(file.path, "utf8"))
        .join("\n")

      for (const prop of parts.flatMap((part) => part.props ?? [])) {
        expect(source, prop.name).toContain(prop.name)
      }
    }
  )
})
