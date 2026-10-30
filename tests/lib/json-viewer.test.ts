import { describe, expect, it } from "vitest"

import {
  CHUNK_SIZE,
  childEntries,
  childPath,
  expandedToDepth,
  formatValue,
  rootEntries,
  searchJson,
} from "@/registry/default/lib/json-viewer"

const DATA = {
  id: "evt_1",
  user: { name: "Ana", "first name": "Ana", tags: ["admin", "ops"] },
  empty: {},
  count: 3,
}

describe("childPath", () => {
  it("joins identifiers with dots, indexes with brackets and quotes other keys", () => {
    expect(childPath("", "user")).toBe("user")
    expect(childPath("user", "name")).toBe("user.name")
    expect(childPath("user.tags", 0)).toBe("user.tags[0]")
    expect(childPath("user", "first name")).toBe('user["first name"]')
  })
})

describe("childEntries", () => {
  it("lists object keys and marks only non-empty containers as branches", () => {
    expect(
      rootEntries(DATA).map((entry) => [entry.id, entry.isBranch])
    ).toEqual([
      ["id", false],
      ["user", true],
      ["empty", false],
      ["count", false],
    ])
  })

  it("splits large arrays into groups and expands a group into its items", () => {
    const items = Array.from(
      { length: CHUNK_SIZE * 2 + 5 },
      (_, index) => index
    )
    const groups = childEntries(items, "items")

    expect(groups.map((group) => group.range)).toEqual([
      [0, 99],
      [100, 199],
      [200, 204],
    ])
    const lastGroup = childEntries(items, "items", groups[2].range)
    expect(lastGroup.map((entry) => entry.path)).toEqual([
      "items[200]",
      "items[201]",
      "items[202]",
      "items[203]",
      "items[204]",
    ])
  })

  it("keeps arrays at the chunk size flat", () => {
    const items = Array.from({ length: CHUNK_SIZE }, (_, index) => index)
    expect(childEntries(items, "")).toHaveLength(CHUNK_SIZE)
  })

  it("wraps a primitive root in a single leaf", () => {
    expect(rootEntries(42)).toEqual([
      { id: "$", path: "", key: null, value: 42, isBranch: false },
    ])
  })
})

describe("expandedToDepth", () => {
  it("opens branches down to the given level", () => {
    expect(expandedToDepth(DATA, 0)).toEqual([])
    expect(expandedToDepth(DATA, 1)).toEqual(["user"])
    expect(expandedToDepth(DATA, 2)).toEqual(["user", "user.tags"])
  })
})

describe("searchJson", () => {
  it("matches keys and primitive values and returns their ancestors", () => {
    const { matches, ancestors } = searchJson(DATA, "OPS")
    expect([...matches]).toEqual(["user.tags[1]"])
    expect([...ancestors]).toEqual(["user", "user.tags"])
  })

  it("opens the group holding a match in a large array", () => {
    const data = {
      items: Array.from({ length: 150 }, (_, index) => `item ${index}`),
    }
    const { ancestors } = searchJson(data, "item 120")
    expect([...ancestors]).toEqual(["items", "items#100"])
  })

  it("ignores array indexes and blank queries", () => {
    expect(searchJson(DATA, "0").matches.size).toBe(0)
    expect(searchJson(DATA, "  ").matches.size).toBe(0)
  })
})

describe("formatValue", () => {
  it("copies strings raw and everything else as JSON", () => {
    expect(formatValue("Ana")).toBe("Ana")
    expect(formatValue(null)).toBe("null")
    expect(formatValue(["a"])).toBe('[\n  "a"\n]')
  })
})
