export type DiffSegment = { text: string; changed: boolean }

export type DiffLine = {
  type: "equal" | "add" | "remove"
  text: string
  oldNumber: number | null
  newNumber: number | null
  segments?: DiffSegment[]
}

export type DiffPair = { old: DiffLine | null; new: DiffLine | null }

export type DiffBlock =
  | { kind: "lines"; lines: DiffLine[] }
  | { kind: "unchanged"; id: number; lines: DiffLine[] }

type Edit = DiffLine["type"]

const MAX_EDIT_DISTANCE = 2000

function backtrack(trace: Int32Array[], oldLength: number, newLength: number) {
  const edits: Edit[] = []
  let x = oldLength
  let y = newLength

  for (let distance = trace.length - 1; distance > 0; distance--) {
    const furthest = trace[distance]
    const diagonal = x - y
    const at = (k: number) => furthest[k + distance + 1]
    const movedDown =
      diagonal === -distance ||
      (diagonal !== distance && at(diagonal - 1) < at(diagonal + 1))
    const previousDiagonal = movedDown ? diagonal + 1 : diagonal - 1
    const previousX = at(previousDiagonal)
    const previousY = previousX - previousDiagonal

    while (x > previousX && y > previousY) {
      edits.push("equal")
      x--
      y--
    }
    edits.push(movedDown ? "add" : "remove")
    x = previousX
    y = previousY
  }

  for (; x > 0; x--) edits.push("equal")
  return edits.reverse()
}

function shortestEdits(oldItems: string[], newItems: string[]): Edit[] {
  const oldLength = oldItems.length
  const newLength = newItems.length
  const limit = Math.min(oldLength + newLength, MAX_EDIT_DISTANCE)
  const center = limit + 1
  const furthest = new Int32Array(2 * limit + 3)
  const trace: Int32Array[] = []

  for (let distance = 0; distance <= limit; distance++) {
    trace.push(furthest.slice(center - distance - 1, center + distance + 2))

    for (let diagonal = -distance; diagonal <= distance; diagonal += 2) {
      const movesDown =
        diagonal === -distance ||
        (diagonal !== distance &&
          furthest[center + diagonal - 1] < furthest[center + diagonal + 1])
      let x = movesDown
        ? furthest[center + diagonal + 1]
        : furthest[center + diagonal - 1] + 1
      let y = x - diagonal

      while (x < oldLength && y < newLength && oldItems[x] === newItems[y]) {
        x++
        y++
      }
      furthest[center + diagonal] = x

      if (x >= oldLength && y >= newLength) {
        return backtrack(trace, oldLength, newLength)
      }
    }
  }

  return [
    ...oldItems.map((): Edit => "remove"),
    ...newItems.map((): Edit => "add"),
  ]
}

export function diffSequences(oldItems: string[], newItems: string[]): Edit[] {
  const shortest = Math.min(oldItems.length, newItems.length)
  let prefix = 0
  while (prefix < shortest && oldItems[prefix] === newItems[prefix]) prefix++

  let suffix = 0
  while (
    suffix < shortest - prefix &&
    oldItems[oldItems.length - 1 - suffix] ===
      newItems[newItems.length - 1 - suffix]
  ) {
    suffix++
  }

  return [
    ...Array.from({ length: prefix }, (): Edit => "equal"),
    ...shortestEdits(
      oldItems.slice(prefix, oldItems.length - suffix),
      newItems.slice(prefix, newItems.length - suffix)
    ),
    ...Array.from({ length: suffix }, (): Edit => "equal"),
  ]
}

function tokenize(text: string) {
  return text.match(/\s+|[\p{L}\p{N}_]+|[^\s\p{L}\p{N}_]/gu) ?? []
}

function appendSegment(
  segments: DiffSegment[],
  text: string,
  changed: boolean
) {
  const last = segments.at(-1)
  if (last?.changed === changed) last.text += text
  else segments.push({ text, changed })
}

export function diffWords(oldText: string, newText: string) {
  const oldTokens = tokenize(oldText)
  const newTokens = tokenize(newText)
  const oldSegments: DiffSegment[] = []
  const newSegments: DiffSegment[] = []
  let oldIndex = 0
  let newIndex = 0
  let hasSharedWord = false

  for (const edit of diffSequences(oldTokens, newTokens)) {
    if (edit === "equal") {
      hasSharedWord ||= oldTokens[oldIndex].trim() !== ""
      appendSegment(oldSegments, oldTokens[oldIndex++], false)
      appendSegment(newSegments, newTokens[newIndex++], false)
    } else if (edit === "remove") {
      appendSegment(oldSegments, oldTokens[oldIndex++], true)
    } else {
      appendSegment(newSegments, newTokens[newIndex++], true)
    }
  }

  return hasSharedWord ? { old: oldSegments, new: newSegments } : null
}

function splitLines(text: string) {
  return text === "" ? [] : text.split(/\r?\n/)
}

export function diffLines(oldText: string, newText: string) {
  const oldLines = splitLines(oldText)
  const newLines = splitLines(newText)
  const lines: DiffLine[] = []
  let removed: DiffLine[] = []
  let added: DiffLine[] = []
  let oldIndex = 0
  let newIndex = 0

  function flushChanges() {
    removed.forEach((line, index) => {
      const partner = added[index]
      const words = partner && diffWords(line.text, partner.text)
      if (!words) return
      line.segments = words.old
      partner.segments = words.new
    })
    lines.push(...removed, ...added)
    removed = []
    added = []
  }

  for (const edit of diffSequences(oldLines, newLines)) {
    if (edit === "remove") {
      removed.push({
        type: "remove",
        text: oldLines[oldIndex++],
        oldNumber: oldIndex,
        newNumber: null,
      })
    } else if (edit === "add") {
      added.push({
        type: "add",
        text: newLines[newIndex++],
        oldNumber: null,
        newNumber: newIndex,
      })
    } else {
      flushChanges()
      lines.push({
        type: "equal",
        text: oldLines[oldIndex++],
        oldNumber: oldIndex,
        newNumber: ++newIndex,
      })
    }
  }
  flushChanges()

  return lines
}

export function pairLines(lines: DiffLine[]) {
  const pairs: DiffPair[] = []
  let index = 0

  while (index < lines.length) {
    if (lines[index].type === "equal") {
      pairs.push({ old: lines[index], new: lines[index] })
      index++
      continue
    }
    const removed: DiffLine[] = []
    const added: DiffLine[] = []
    for (; lines[index]?.type === "remove"; index++) removed.push(lines[index])
    for (; lines[index]?.type === "add"; index++) added.push(lines[index])
    for (let row = 0; row < Math.max(removed.length, added.length); row++) {
      pairs.push({ old: removed[row] ?? null, new: added[row] ?? null })
    }
  }

  return pairs
}

export function collapseUnchanged(lines: DiffLine[], contextLines: number) {
  const blocks: DiffBlock[] = []
  let visible: DiffLine[] = []

  function flushVisible() {
    if (visible.length > 0) blocks.push({ kind: "lines", lines: visible })
    visible = []
  }

  let start = 0
  while (start < lines.length) {
    let end = start
    const isEqual = lines[start].type === "equal"
    while (end < lines.length && (lines[end].type === "equal") === isEqual)
      end++

    const run = lines.slice(start, end)
    const leading = start === 0 ? 0 : contextLines
    const trailing = end === lines.length ? 0 : contextLines
    const hiddenCount = run.length - leading - trailing

    if (isEqual && hiddenCount > 1) {
      visible.push(...run.slice(0, leading))
      flushVisible()
      blocks.push({
        kind: "unchanged",
        id: start,
        lines: run.slice(leading, leading + hiddenCount),
      })
      visible.push(...run.slice(leading + hiddenCount))
    } else {
      visible.push(...run)
    }
    start = end
  }
  flushVisible()

  return blocks
}
