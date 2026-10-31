export interface TransferItem {
  id: string
  label: string
  description?: string
  disabled?: boolean
  [key: string]: unknown
}

export function partitionItems<T extends { id: string }>(
  items: readonly T[],
  selectedIds: readonly string[],
  getKey: (item: T) => string = (item) => item.id
): { sourceItems: T[]; targetItems: T[] } {
  const selectedSet = new Set(selectedIds)
  const sourceItems: T[] = []
  const targetItems: T[] = []

  for (const item of items) {
    if (selectedSet.has(getKey(item))) {
      targetItems.push(item)
    } else {
      sourceItems.push(item)
    }
  }

  return { sourceItems, targetItems }
}

export function filterTransferItems<
  T extends { label?: string; description?: string },
>(
  items: readonly T[],
  query: string,
  getSearchText?: (item: T) => string
): T[] {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return [...items]

  return items.filter((item) => {
    if (getSearchText) {
      return getSearchText(item).toLowerCase().includes(normalizedQuery)
    }
    const label = item.label ?? ""
    const description = item.description ?? ""
    return (
      label.toLowerCase().includes(normalizedQuery) ||
      description.toLowerCase().includes(normalizedQuery)
    )
  })
}

export function moveItems(
  currentSelectedIds: readonly string[],
  idsToMove: readonly string[],
  direction: "toTarget" | "toSource"
): string[] {
  const moveSet = new Set(idsToMove)
  if (direction === "toTarget") {
    const existing = new Set(currentSelectedIds)
    const next = [...currentSelectedIds]
    for (const id of idsToMove) {
      if (!existing.has(id)) {
        next.push(id)
      }
    }
    return next
  }

  return currentSelectedIds.filter((id) => !moveSet.has(id))
}

export function moveAll<T extends { id: string; disabled?: boolean }>(
  items: readonly T[],
  currentSelectedIds: readonly string[],
  direction: "toTarget" | "toSource",
  getKey: (item: T) => string = (item) => item.id
): string[] {
  if (direction === "toTarget") {
    const currentSet = new Set(currentSelectedIds)
    const next = [...currentSelectedIds]
    for (const item of items) {
      const key = getKey(item)
      if (!item.disabled && !currentSet.has(key)) {
        next.push(key)
      }
    }
    return next
  }

  const disabledTargetKeys = new Set(
    items
      .filter(
        (item) => item.disabled && currentSelectedIds.includes(getKey(item))
      )
      .map(getKey)
  )
  return currentSelectedIds.filter((id) => disabledTargetKeys.has(id))
}

export function selectRange(
  itemIds: readonly string[],
  fromId: string,
  toId: string,
  currentChecked: readonly string[]
): string[] {
  const fromIndex = itemIds.indexOf(fromId)
  const toIndex = itemIds.indexOf(toId)
  if (fromIndex === -1 || toIndex === -1) return [...currentChecked]

  const start = Math.min(fromIndex, toIndex)
  const end = Math.max(fromIndex, toIndex)
  const rangeIds = itemIds.slice(start, end + 1)

  const checkedSet = new Set(currentChecked)
  for (const id of rangeIds) {
    checkedSet.add(id)
  }
  return Array.from(checkedSet)
}

export function getTransferAnnouncement(
  count: number,
  direction: "toTarget" | "toSource",
  titles: [string, string]
): string {
  const destination = direction === "toTarget" ? titles[1] : titles[0]
  return `Moved ${count} ${count === 1 ? "item" : "items"} to ${destination}.`
}
