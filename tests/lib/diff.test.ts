import { describe, expect, it } from "vitest"

import {
  collapseUnchanged,
  diffLines,
  diffSequences,
  diffWords,
  pairLines,
  type DiffLine,
} from "@/registry/default/lib/diff"

function applyEdits(
  oldItems: string[],
  newItems: string[],
  edits: ReturnType<typeof diffSequences>
) {
  const rebuiltOld: string[] = []
  const rebuiltNew: string[] = []
  let oldIndex = 0
  let newIndex = 0
  for (const edit of edits) {
    if (edit !== "add") rebuiltOld.push(oldItems[oldIndex++])
    if (edit !== "remove") rebuiltNew.push(newItems[newIndex++])
  }
  return { rebuiltOld, rebuiltNew }
}

function shape(lines: DiffLine[]) {
  return lines.map((line) => `${line.type[0]} ${line.text}`)
}

function equalLines(count: number, from = 1): DiffLine[] {
  return Array.from({ length: count }, (_, index) => ({
    type: "equal",
    text: `line ${from + index}`,
    oldNumber: from + index,
    newNumber: from + index,
  }))
}

const CHANGE: DiffLine = {
  type: "add",
  text: "new",
  oldNumber: null,
  newNumber: 1,
}

describe("diffSequences", () => {
  it.each([
    [[], []],
    [["a"], []],
    [[], ["a"]],
    [
      ["a", "b", "c"],
      ["a", "b", "c"],
    ],
    [
      ["a", "b", "c", "a", "b", "b", "a"],
      ["c", "b", "a", "b", "a", "c"],
    ],
    [
      ["x", "y"],
      ["p", "q", "r"],
    ],
    [["a", "a", "a"], ["a"]],
  ])("rebuilds both sides from %j to %j", (oldItems, newItems) => {
    const edits = diffSequences(oldItems, newItems)

    expect(applyEdits(oldItems, newItems, edits)).toEqual({
      rebuiltOld: oldItems,
      rebuiltNew: newItems,
    })
  })

  it("finds the shortest edit script", () => {
    const edits = diffSequences(
      ["a", "b", "c", "a", "b", "b", "a"],
      ["c", "b", "a", "b", "a", "c"]
    )

    expect(edits.filter((edit) => edit !== "equal")).toHaveLength(5)
  })

  it("falls back to replacing everything past the edit distance limit", () => {
    const oldItems = Array.from({ length: 3000 }, (_, index) => `old ${index}`)
    const newItems = Array.from({ length: 3000 }, (_, index) => `new ${index}`)

    const edits = diffSequences(oldItems, newItems)

    expect(edits).toHaveLength(6000)
    expect(edits.slice(0, 3000).every((edit) => edit === "remove")).toBe(true)
    expect(edits.slice(3000).every((edit) => edit === "add")).toBe(true)
  })

  it("keeps shared lines around an over-limit middle", () => {
    const middle = (label: string) =>
      Array.from({ length: 3000 }, (_, index) => `${label} ${index}`)

    const edits = diffSequences(
      ["head", ...middle("old"), "tail"],
      ["head", ...middle("new"), "tail"]
    )

    expect(edits[0]).toBe("equal")
    expect(edits.at(-1)).toBe("equal")
  })
})

describe("diffWords", () => {
  it("marks only the changed words", () => {
    expect(diffWords("timeout: 30 seconds", "timeout: 60 seconds")).toEqual({
      old: [
        { text: "timeout: ", changed: false },
        { text: "30", changed: true },
        { text: " seconds", changed: false },
      ],
      new: [
        { text: "timeout: ", changed: false },
        { text: "60", changed: true },
        { text: " seconds", changed: false },
      ],
    })
  })

  it("treats accented words as one token", () => {
    expect(diffWords("déjà vu", "déjà lu")?.new).toEqual([
      { text: "déjà ", changed: false },
      { text: "lu", changed: true },
    ])
  })

  it("returns null when only whitespace is shared", () => {
    expect(diffWords("alpha beta", "gamma delta")).toBeNull()
  })
})

describe("diffLines", () => {
  it("numbers each side and lists removals before additions", () => {
    expect(diffLines("a\nb\nc", "a\nx\nc")).toMatchObject([
      { type: "equal", text: "a", oldNumber: 1, newNumber: 1 },
      { type: "remove", text: "b", oldNumber: 2, newNumber: null },
      { type: "add", text: "x", oldNumber: null, newNumber: 2 },
      { type: "equal", text: "c", oldNumber: 3, newNumber: 3 },
    ])
  })

  it("adds word segments to paired lines that share words", () => {
    const [removed, added] = diffLines("retries: 3", "retries: 5")

    expect(removed.segments).toContainEqual({ text: "3", changed: true })
    expect(added.segments).toContainEqual({ text: "5", changed: true })
  })

  it("leaves unrelated replacements without segments", () => {
    const [removed, added] = diffLines("alpha", "beta")

    expect(removed.segments).toBeUndefined()
    expect(added.segments).toBeUndefined()
  })

  it("treats CRLF and LF line endings the same", () => {
    expect(shape(diffLines("a\r\nb", "a\nb"))).toEqual(["e a", "e b"])
  })

  it("shows a removed trailing newline as a removed empty line", () => {
    expect(shape(diffLines("a\n", "a"))).toEqual(["e a", "r "])
  })

  it("handles empty input on either side", () => {
    expect(shape(diffLines("", ""))).toEqual([])
    expect(shape(diffLines("", "a"))).toEqual(["a a"])
    expect(shape(diffLines("a", ""))).toEqual(["r a"])
  })
})

describe("pairLines", () => {
  it("lines up replacements and leaves gaps for uneven blocks", () => {
    const pairs = pairLines(diffLines("a\nb\nc\nz", "x\nz"))

    expect(
      pairs.map((pair) => [pair.old?.text ?? null, pair.new?.text ?? null])
    ).toEqual([
      ["a", "x"],
      ["b", null],
      ["c", null],
      ["z", "z"],
    ])
  })

  it("puts an unchanged line on both sides", () => {
    const [pair] = pairLines(diffLines("a", "a"))

    expect(pair.old).toBe(pair.new)
  })
})

describe("collapseUnchanged", () => {
  it("keeps contextLines around a change and hides the rest", () => {
    const lines = [...equalLines(10), CHANGE, ...equalLines(10, 11)]

    const blocks = collapseUnchanged(lines, 2)

    expect(blocks.map((block) => [block.kind, block.lines.length])).toEqual([
      ["unchanged", 8],
      ["lines", 5],
      ["unchanged", 8],
    ])
  })

  it("keeps context on both sides of a run between two changes", () => {
    const lines = [CHANGE, ...equalLines(10), { ...CHANGE, newNumber: 12 }]

    const blocks = collapseUnchanged(lines, 3)

    expect(blocks.map((block) => [block.kind, block.lines.length])).toEqual([
      ["lines", 4],
      ["unchanged", 4],
      ["lines", 4],
    ])
  })

  it("does not collapse a single line", () => {
    const lines = [CHANGE, ...equalLines(3), { ...CHANGE, newNumber: 5 }]

    const blocks = collapseUnchanged(lines, 1)

    expect(blocks.map((block) => block.kind)).toEqual(["lines"])
  })

  it("collapses a diff with no changes into one block", () => {
    const blocks = collapseUnchanged(equalLines(5), 3)

    expect(blocks).toHaveLength(1)
    expect(blocks[0].kind).toBe("unchanged")
  })

  it("returns nothing for empty input", () => {
    expect(collapseUnchanged([], 3)).toEqual([])
  })
})
