"use client"

import * as React from "react"
import { GripVerticalIcon } from "lucide-react"

import { cn } from "@/registry/default/lib/utils"
import { useControllableState } from "@/registry/default/hooks/use-controllable-state"
import {
  getCancelAnnouncement,
  getDropAnnouncement,
  getMoveAnnouncement,
  getPickupAnnouncement,
  getTargetIndex,
  reorderItem,
  type SortableOrientation,
} from "@/registry/default/lib/sortable-list"

interface SortableContextValue {
  activeKey: string | number | null
  isGrabbed: boolean
  isDragging: boolean
  orientation: SortableOrientation
  disabled: boolean
  instructionsId: string
  registerItem: (key: string | number, element: HTMLElement) => void
  unregisterItem: (key: string | number) => void
  registerHandle: (key: string | number) => void
  unregisterHandle: (key: string | number) => void
  hasHandle: (key: string | number) => boolean
  onItemKeyDown: (
    event: React.KeyboardEvent<HTMLElement>,
    key: string | number
  ) => void
  onPointerStart: (
    event: React.PointerEvent<HTMLElement>,
    key: string | number
  ) => void
}

const SortableContext = React.createContext<SortableContextValue | null>(null)

function useSortableContext() {
  const context = React.useContext(SortableContext)
  if (!context) {
    throw new Error(
      "SortableItem and SortableDragHandle must be used within a SortableList"
    )
  }
  return context
}

export interface SortableListProps<T> extends Omit<
  React.ComponentProps<"ul">,
  "children" | "defaultValue"
> {
  value?: T[]
  defaultValue?: T[]
  onValueChange?: (items: T[]) => void
  getKey?: (item: T, index: number) => string | number
  getItemLabel?: (item: T, index: number) => string
  orientation?: SortableOrientation
  disabled?: boolean
  children?: React.ReactNode | ((item: T, index: number) => React.ReactNode)
}

export function SortableList<T>({
  value,
  defaultValue = [],
  onValueChange,
  getKey = (item, index) =>
    typeof item === "object" && item !== null && "id" in item
      ? String((item as { id: unknown }).id)
      : index,
  getItemLabel = (item, index) => {
    if (typeof item === "object" && item !== null) {
      if ("label" in item && typeof item.label === "string") return item.label
      if ("title" in item && typeof item.title === "string") return item.title
      if ("name" in item && typeof item.name === "string") return item.name
    }
    if (typeof item === "string") return item
    return `Item ${index + 1}`
  },
  orientation = "vertical",
  disabled = false,
  className,
  children,
  ...props
}: SortableListProps<T>) {
  const { value: items, setValue: setItems } = useControllableState<T[]>({
    value,
    defaultValue,
    onChange: onValueChange,
  })

  const [activeKey, setActiveKey] = React.useState<string | number | null>(null)
  const [isGrabbed, setIsGrabbed] = React.useState(false)
  const [isDragging, setIsDragging] = React.useState(false)
  const [announcement, setAnnouncement] = React.useState("")

  const itemElementsRef = React.useRef(new Map<string | number, HTMLElement>())
  const hasHandleRef = React.useRef(new Set<string | number>())
  const initialItemsRef = React.useRef<T[]>(items)
  const pointerDragRef = React.useRef<{
    key: string | number
    pointerId: number
    startY: number
    startX: number
    hasMoved: boolean
  } | null>(null)

  const instructionsId = React.useId()

  const registerItem = React.useCallback(
    (key: string | number, element: HTMLElement) => {
      itemElementsRef.current.set(key, element)
    },
    []
  )

  const unregisterItem = React.useCallback((key: string | number) => {
    itemElementsRef.current.delete(key)
  }, [])

  const registerHandle = React.useCallback((key: string | number) => {
    hasHandleRef.current.add(key)
  }, [])

  const unregisterHandle = React.useCallback((key: string | number) => {
    hasHandleRef.current.delete(key)
  }, [])

  const hasHandle = React.useCallback((key: string | number) => {
    return hasHandleRef.current.has(key)
  }, [])

  const findIndexByKey = React.useCallback(
    (key: string | number) => {
      return items.findIndex((item, index) => getKey(item, index) === key)
    },
    [items, getKey]
  )

  const cancelReorder = React.useCallback(() => {
    if (activeKey !== null) {
      const originalIndex = initialItemsRef.current.findIndex(
        (item, index) => getKey(item, index) === activeKey
      )
      const label =
        originalIndex !== -1
          ? getItemLabel(initialItemsRef.current[originalIndex], originalIndex)
          : String(activeKey)

      setItems(initialItemsRef.current)
      setAnnouncement(
        getCancelAnnouncement(
          label,
          originalIndex !== -1 ? originalIndex : 0,
          initialItemsRef.current.length
        )
      )
    }
    setActiveKey(null)
    setIsGrabbed(false)
    setIsDragging(false)
    pointerDragRef.current = null
  }, [activeKey, getKey, getItemLabel, setItems])

  const dropItem = React.useCallback(() => {
    if (activeKey !== null) {
      const currentIndex = findIndexByKey(activeKey)
      if (currentIndex !== -1) {
        const label = getItemLabel(items[currentIndex], currentIndex)
        setAnnouncement(getDropAnnouncement(label, currentIndex, items.length))
      }
    }
    setActiveKey(null)
    setIsGrabbed(false)
    setIsDragging(false)
    pointerDragRef.current = null
  }, [activeKey, findIndexByKey, getItemLabel, items])

  const onItemKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLElement>, key: string | number) => {
      if (disabled) return

      const currentIndex = findIndexByKey(key)
      if (currentIndex === -1) return

      const currentItem = items[currentIndex]
      const label = getItemLabel(currentItem, currentIndex)

      if (event.key === " " || event.key === "Enter") {
        event.preventDefault()
        if (isGrabbed && activeKey === key) {
          dropItem()
        } else {
          initialItemsRef.current = items
          setActiveKey(key)
          setIsGrabbed(true)
          setIsDragging(false)
          setAnnouncement(
            getPickupAnnouncement(label, currentIndex, items.length)
          )
        }
        return
      }

      if (event.key === "Escape" && isGrabbed && activeKey === key) {
        event.preventDefault()
        cancelReorder()
        return
      }

      if (isGrabbed && activeKey === key) {
        const targetIndex = getTargetIndex(
          event.key,
          currentIndex,
          items.length,
          orientation
        )

        if (targetIndex !== null && targetIndex !== currentIndex) {
          event.preventDefault()
          const nextItems = reorderItem(items, currentIndex, targetIndex)
          setItems(nextItems)
          setAnnouncement(getMoveAnnouncement(label, targetIndex, items.length))

          requestAnimationFrame(() => {
            const el = itemElementsRef.current.get(key)
            if (el) {
              const handle = el.querySelector<HTMLElement>(
                "[data-sortable-handle]"
              )
              ;(handle ?? el).focus()
            }
          })
        }
      }
    },
    [
      disabled,
      findIndexByKey,
      items,
      getItemLabel,
      isGrabbed,
      activeKey,
      dropItem,
      cancelReorder,
      orientation,
      setItems,
    ]
  )

  const onPointerStart = React.useCallback(
    (event: React.PointerEvent<HTMLElement>, key: string | number) => {
      if (disabled || event.button !== 0) return

      initialItemsRef.current = items
      pointerDragRef.current = {
        key,
        pointerId: event.pointerId,
        startY: event.clientY,
        startX: event.clientX,
        hasMoved: false,
      }

      const target = event.currentTarget
      target.setPointerCapture(event.pointerId)
    },
    [disabled, items]
  )

  const onPointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLUListElement>) => {
      const drag = pointerDragRef.current
      if (!drag || drag.pointerId !== event.pointerId) return

      const deltaX = Math.abs(event.clientX - drag.startX)
      const deltaY = Math.abs(event.clientY - drag.startY)

      if (!drag.hasMoved && (deltaX > 4 || deltaY > 4)) {
        drag.hasMoved = true
        setActiveKey(drag.key)
        setIsDragging(true)
        setIsGrabbed(false)

        const currentIndex = findIndexByKey(drag.key)
        if (currentIndex !== -1) {
          const label = getItemLabel(items[currentIndex], currentIndex)
          setAnnouncement(
            getPickupAnnouncement(label, currentIndex, items.length)
          )
        }
      }

      if (drag.hasMoved) {
        const elementBelow = document.elementFromPoint(
          event.clientX,
          event.clientY
        )
        const targetItemEl = elementBelow?.closest<HTMLElement>(
          "[data-sortable-item]"
        )

        if (targetItemEl) {
          const targetKeyStr = targetItemEl.dataset.sortableKey
          if (targetKeyStr !== undefined) {
            const targetKey =
              typeof drag.key === "number" ? Number(targetKeyStr) : targetKeyStr

            if (targetKey !== drag.key) {
              const fromIndex = findIndexByKey(drag.key)
              const toIndex = findIndexByKey(targetKey)

              if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
                const item = items[fromIndex]
                const label = getItemLabel(item, fromIndex)
                const nextItems = reorderItem(items, fromIndex, toIndex)
                setItems(nextItems)
                setAnnouncement(
                  getMoveAnnouncement(label, toIndex, items.length)
                )
              }
            }
          }
        }
      }
    },
    [findIndexByKey, getItemLabel, items, setItems]
  )

  const onPointerEnd = React.useCallback(
    (event: React.PointerEvent<HTMLUListElement>) => {
      const drag = pointerDragRef.current
      if (!drag || drag.pointerId !== event.pointerId) return

      if (drag.hasMoved) {
        dropItem()
      } else {
        pointerDragRef.current = null
      }
    },
    [dropItem]
  )

  const renderedChildren =
    typeof children === "function"
      ? items.map((item, index) =>
          (children as (item: T, index: number) => React.ReactNode)(item, index)
        )
      : children

  return (
    <SortableContext.Provider
      value={{
        activeKey,
        isGrabbed,
        isDragging,
        orientation,
        disabled,
        instructionsId,
        registerItem,
        unregisterItem,
        registerHandle,
        unregisterHandle,
        hasHandle,
        onItemKeyDown,
        onPointerStart,
      }}
    >
      <ul
        role="list"
        data-orientation={orientation}
        data-disabled={disabled ? "" : undefined}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        className={cn(
          "flex select-none",
          orientation === "vertical" ? "flex-col gap-2" : "flex-row gap-2",
          className
        )}
        {...props}
      >
        {renderedChildren}
      </ul>

      <span id={instructionsId} className="sr-only">
        Press Space or Enter to pick up the item. Use arrow keys to reorder.
        Press Space or Enter again to drop. Press Escape to cancel.
      </span>

      <span aria-live="assertive" aria-atomic="true" className="sr-only">
        {announcement}
      </span>
    </SortableContext.Provider>
  )
}

export interface SortableItemProps extends React.ComponentProps<"li"> {
  value: string | number
  disabled?: boolean
}

export function SortableItem({
  value,
  disabled: itemDisabled = false,
  className,
  children,
  onKeyDown,
  onPointerDown,
  ...props
}: SortableItemProps) {
  const {
    activeKey,
    isGrabbed,
    isDragging,
    orientation,
    disabled: listDisabled,
    instructionsId,
    registerItem,
    unregisterItem,
    hasHandle,
    onItemKeyDown,
    onPointerStart,
  } = useSortableContext()

  const elementRef = React.useRef<HTMLLIElement>(null)
  const disabled = listDisabled || itemDisabled
  const isItemActive = activeKey === value
  const isItemGrabbed = isItemActive && isGrabbed
  const isItemDragging = isItemActive && isDragging
  const itemHasHandle = hasHandle(value)

  React.useEffect(() => {
    if (elementRef.current) {
      registerItem(value, elementRef.current)
    }
    return () => unregisterItem(value)
  }, [value, registerItem, unregisterItem])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>) => {
    onKeyDown?.(event)
    if (!itemHasHandle && !event.defaultPrevented) {
      onItemKeyDown(event, value)
    }
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLLIElement>) => {
    onPointerDown?.(event)
    if (!itemHasHandle && !event.defaultPrevented) {
      onPointerStart(event, value)
    }
  }

  return (
    <li
      ref={elementRef}
      role="listitem"
      data-sortable-item=""
      data-sortable-key={String(value)}
      data-grabbed={isItemGrabbed ? "" : undefined}
      data-dragging={isItemDragging ? "" : undefined}
      data-orientation={orientation}
      data-disabled={disabled ? "" : undefined}
      tabIndex={!itemHasHandle && !disabled ? 0 : undefined}
      aria-roledescription="sortable item"
      aria-grabbed={isItemGrabbed || isItemDragging}
      aria-describedby={!itemHasHandle ? instructionsId : undefined}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-card-foreground shadow-xs transition-all",
        !itemHasHandle && !disabled && "cursor-grab active:cursor-grabbing",
        !itemHasHandle &&
          "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
        isItemGrabbed && "z-10 border-ring shadow-md ring-2 ring-ring",
        isItemDragging &&
          "z-20 scale-[1.01] cursor-grabbing border-ring opacity-90 shadow-lg",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </li>
  )
}

export interface SortableDragHandleProps extends React.ComponentProps<"button"> {
  value?: string | number
}

export function SortableDragHandle({
  className,
  children,
  onKeyDown,
  onPointerDown,
  ...props
}: SortableDragHandleProps) {
  const {
    activeKey,
    isGrabbed,
    disabled: listDisabled,
    instructionsId,
    registerHandle,
    unregisterHandle,
    onItemKeyDown,
    onPointerStart,
  } = useSortableContext()

  // Retrieve item key from nearest SortableItem
  const [itemKey, setItemKey] = React.useState<string | number | null>(null)

  const handleRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      if (node) {
        const itemEl = node.closest<HTMLElement>("[data-sortable-item]")
        const keyStr = itemEl?.dataset.sortableKey
        if (keyStr !== undefined) {
          setItemKey(keyStr)
          registerHandle(keyStr)
        }
      }
    },
    [registerHandle]
  )

  React.useEffect(() => {
    return () => {
      if (itemKey !== null) {
        unregisterHandle(itemKey)
      }
    }
  }, [itemKey, unregisterHandle])

  const isHandleGrabbed = itemKey !== null && activeKey === itemKey && isGrabbed

  return (
    <button
      ref={handleRef}
      type="button"
      data-sortable-handle=""
      aria-label="Reorder item"
      aria-describedby={instructionsId}
      aria-pressed={isHandleGrabbed}
      disabled={listDisabled}
      tabIndex={listDisabled ? -1 : 0}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (itemKey !== null && !event.defaultPrevented) {
          onItemKeyDown(event, itemKey)
        }
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event)
        if (itemKey !== null && !event.defaultPrevented) {
          onPointerStart(event, itemKey)
        }
      }}
      className={cn(
        "shrink-0 cursor-grab touch-none rounded p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:cursor-grabbing",
        isHandleGrabbed && "cursor-grabbing text-foreground",
        className
      )}
      {...props}
    >
      {children ?? <GripVerticalIcon className="size-4" />}
    </button>
  )
}
