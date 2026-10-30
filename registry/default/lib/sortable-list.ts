export type SortableOrientation = "vertical" | "horizontal"

export function reorderItem<T>(
  items: readonly T[],
  fromIndex: number,
  toIndex: number
): T[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    fromIndex >= items.length ||
    toIndex < 0 ||
    toIndex >= items.length
  ) {
    return [...items]
  }

  const result = [...items]
  const [removed] = result.splice(fromIndex, 1)
  result.splice(toIndex, 0, removed)
  return result
}

export function getPickupAnnouncement(
  itemLabel: string,
  index: number,
  total: number
): string {
  return `Picked up ${itemLabel}, position ${index + 1} of ${total}. Use arrow keys to move, Space to drop, Escape to cancel.`
}

export function getMoveAnnouncement(
  itemLabel: string,
  index: number,
  total: number
): string {
  return `Moved ${itemLabel} to position ${index + 1} of ${total}.`
}

export function getDropAnnouncement(
  itemLabel: string,
  index: number,
  total: number
): string {
  return `Dropped ${itemLabel}, final position ${index + 1} of ${total}.`
}

export function getCancelAnnouncement(
  itemLabel: string,
  originalIndex: number,
  total: number
): string {
  return `Reorder cancelled. ${itemLabel} returned to position ${originalIndex + 1} of ${total}.`
}

export function getTargetIndex(
  key: string,
  currentIndex: number,
  totalCount: number,
  orientation: SortableOrientation = "vertical"
): number | null {
  const isPreviousKey =
    (orientation === "vertical" && key === "ArrowUp") ||
    (orientation === "horizontal" && key === "ArrowLeft")

  const isNextKey =
    (orientation === "vertical" && key === "ArrowDown") ||
    (orientation === "horizontal" && key === "ArrowRight")

  if (isPreviousKey) {
    return Math.max(0, currentIndex - 1)
  }

  if (isNextKey) {
    return Math.min(totalCount - 1, currentIndex + 1)
  }

  if (key === "Home") {
    return 0
  }

  if (key === "End") {
    return totalCount - 1
  }

  return null
}
