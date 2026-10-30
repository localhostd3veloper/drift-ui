export const CHUNK_SIZE = 100

export type JsonEntry = {
  id: string
  path: string
  key: string | number | null
  value: unknown
  isBranch: boolean
  range?: [number, number]
}

const IDENTIFIER_PATTERN = /^[A-Za-z_$][\w$]*$/

export function isContainer(value: unknown): value is object {
  return typeof value === "object" && value !== null
}

export function sizeOf(value: object) {
  return Array.isArray(value) ? value.length : Object.keys(value).length
}

export function childPath(parent: string, key: string | number) {
  if (typeof key === "number") return `${parent}[${key}]`
  if (!IDENTIFIER_PATTERN.test(key)) return `${parent}[${JSON.stringify(key)}]`
  return parent ? `${parent}.${key}` : key
}

function toEntry(parent: string, key: string | number, value: unknown) {
  const path = childPath(parent, key)
  return {
    id: path,
    path,
    key,
    value,
    isBranch: isContainer(value) && sizeOf(value) > 0,
  }
}

export function childEntries(
  value: unknown,
  path: string,
  range?: [number, number]
): JsonEntry[] {
  if (!isContainer(value)) return []
  if (!Array.isArray(value)) {
    return Object.entries(value).map(([key, child]) =>
      toEntry(path, key, child)
    )
  }

  const [start, end] = range ?? [0, value.length - 1]
  if (range || value.length <= CHUNK_SIZE) {
    return value
      .slice(start, end + 1)
      .map((child, offset) => toEntry(path, start + offset, child))
  }

  return Array.from(
    { length: Math.ceil(value.length / CHUNK_SIZE) },
    (_, chunk) => {
      const chunkStart = chunk * CHUNK_SIZE
      return {
        id: `${path}#${chunkStart}`,
        path,
        key: null,
        value,
        isBranch: true,
        range: [
          chunkStart,
          Math.min(chunkStart + CHUNK_SIZE, value.length) - 1,
        ] as [number, number],
      }
    }
  )
}

export function rootEntries(data: unknown): JsonEntry[] {
  if (isContainer(data)) return childEntries(data, "")
  return [{ id: "$", path: "", key: null, value: data, isBranch: false }]
}

export function expandedToDepth(data: unknown, depth: number) {
  const ids: string[] = []

  function walk(entries: JsonEntry[], level: number) {
    if (level > depth) return
    for (const entry of entries) {
      if (!entry.isBranch || entry.range) continue
      ids.push(entry.id)
      walk(childEntries(entry.value, entry.path), level + 1)
    }
  }

  walk(rootEntries(data), 1)
  return ids
}

export function searchJson(data: unknown, query: string) {
  const matches = new Set<string>()
  const ancestors = new Set<string>()
  const needle = query.trim().toLowerCase()
  if (!needle) return { matches, ancestors }

  function walk(entries: JsonEntry[], parents: string[]) {
    for (const entry of entries) {
      const keyHit =
        typeof entry.key === "string" &&
        entry.key.toLowerCase().includes(needle)
      const valueHit =
        !isContainer(entry.value) &&
        String(entry.value).toLowerCase().includes(needle)
      if (keyHit || valueHit) {
        matches.add(entry.id)
        for (const parent of parents) ancestors.add(parent)
      }
      if (entry.isBranch) {
        walk(childEntries(entry.value, entry.path, entry.range), [
          ...parents,
          entry.id,
        ])
      }
    }
  }

  walk(rootEntries(data), [])
  return { matches, ancestors }
}

export function formatValue(value: unknown) {
  return typeof value === "string" ? value : JSON.stringify(value, null, 2)
}
