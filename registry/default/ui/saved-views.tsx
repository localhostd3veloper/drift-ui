"use client"

import * as React from "react"
import {
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  RotateCcwIcon,
  SaveIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react"

import { cn } from "@/registry/default/lib/utils"
import { useControllableState } from "@/registry/default/hooks/use-controllable-state"
import { Badge } from "@/registry/default/ui/badge"
import { Button } from "@/registry/default/ui/button"
import { Input } from "@/registry/default/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover"
import {
  createSavedView,
  deleteSavedView,
  duplicateSavedView,
  getActiveSavedView,
  renameSavedView,
  setDefaultSavedView,
  type SavedView,
} from "@/registry/default/lib/saved-views"

export type { SavedView }

export interface SavedViewsProps<T = unknown> extends Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onReset"
> {
  views?: SavedView<T>[]
  defaultViews?: SavedView<T>[]
  onViewsChange?: (views: SavedView<T>[]) => void

  activeId?: string
  defaultActiveId?: string
  onActiveChange?: (activeId: string) => void

  isDirty?: boolean
  onSave?: (view: SavedView<T>) => void
  onReset?: (view: SavedView<T>) => void

  onCreate?: (view: SavedView<T>) => void
  onRename?: (view: SavedView<T>, newName: string) => void
  onDuplicate?: (newView: SavedView<T>, sourceView: SavedView<T>) => void
  onDelete?: (deletedViewId: string) => void
  onSetDefault?: (defaultViewId: string) => void

  variant?: "tabs" | "select"
  showReset?: boolean
  allowCreate?: boolean
  allowRename?: boolean
  allowDuplicate?: boolean
  allowDelete?: boolean
  allowSetDefault?: boolean
  placeholder?: string
  "aria-label"?: string
}

function SavedViews<T = unknown>({
  views: viewsProp,
  defaultViews = [],
  onViewsChange,
  activeId: activeIdProp,
  defaultActiveId,
  onActiveChange,
  isDirty = false,
  onSave,
  onReset,
  onCreate,
  onRename,
  onDuplicate,
  onDelete,
  onSetDefault,
  variant = "tabs",
  showReset = true,
  allowCreate = true,
  allowRename = true,
  allowDuplicate = true,
  allowDelete = true,
  allowSetDefault = true,
  placeholder = "New view name...",
  "aria-label": ariaLabel = "Saved views",
  className,
  ...props
}: SavedViewsProps<T>) {
  const { value: views, setValue: setViews } = useControllableState<
    SavedView<T>[]
  >({
    value: viewsProp,
    defaultValue: defaultViews,
    onChange: onViewsChange,
  })

  const initialActive = React.useMemo(() => {
    if (defaultActiveId) return defaultActiveId
    const def = views.find((v) => v.isDefault)
    return def ? def.id : (views[0]?.id ?? "")
  }, [defaultActiveId, views])

  const { value: activeId, setValue: setActiveId } =
    useControllableState<string>({
      value: activeIdProp,
      defaultValue: initialActive,
      onChange: onActiveChange,
    })

  const activeView = React.useMemo(
    () => getActiveSavedView(views, activeId),
    [views, activeId]
  )

  const [createOpen, setCreateOpen] = React.useState(false)
  const [newViewName, setNewViewName] = React.useState("")
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editingName, setEditingName] = React.useState("")
  const tabRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map())

  function handleSelect(id: string) {
    setActiveId(id)
  }

  function handleCreateSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    const name = newViewName.trim() || `View ${views.length + 1}`
    const newView = createSavedView<T>(name)
    const nextViews = [...views, newView]
    setViews(nextViews)
    setActiveId(newView.id)
    onCreate?.(newView)
    setNewViewName("")
    setCreateOpen(false)
  }

  function handleStartRename(view: SavedView<T>) {
    setEditingId(view.id)
    setEditingName(view.name)
  }

  function handleRenameSubmit(id: string) {
    const trimmed = editingName.trim()
    if (trimmed) {
      const nextViews = renameSavedView(views, id, trimmed)
      setViews(nextViews)
      const target = views.find((v) => v.id === id)
      if (target) {
        onRename?.({ ...target, name: trimmed }, trimmed)
      }
    }
    setEditingId(null)
  }

  function handleDuplicate(view: SavedView<T>) {
    const duplicated = duplicateSavedView(view, views)
    const nextViews = [...views, duplicated]
    setViews(nextViews)
    setActiveId(duplicated.id)
    onDuplicate?.(duplicated, view)
  }

  function handleDelete(id: string) {
    if (views.length <= 1) return
    const { views: nextViews, nextActiveId } = deleteSavedView(
      views,
      id,
      activeId
    )
    setViews(nextViews)
    if (nextActiveId) {
      setActiveId(nextActiveId)
    }
    onDelete?.(id)
  }

  function handleSetDefault(id: string) {
    const nextViews = setDefaultSavedView(views, id)
    setViews(nextViews)
    onSetDefault?.(id)
  }

  function handleTabKeyDown(
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
    view: SavedView<T>
  ) {
    if (e.key === "F2" && allowRename && !view.isLocked) {
      e.preventDefault()
      handleStartRename(view)
      return
    }

    if (e.key === "ArrowRight") {
      e.preventDefault()
      const nextIndex = (index + 1) % views.length
      const nextView = views[nextIndex]
      if (nextView) {
        setActiveId(nextView.id)
        tabRefs.current.get(nextView.id)?.focus()
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      const prevIndex = (index - 1 + views.length) % views.length
      const prevView = views[prevIndex]
      if (prevView) {
        setActiveId(prevView.id)
        tabRefs.current.get(prevView.id)?.focus()
      }
    } else if (e.key === "Home") {
      e.preventDefault()
      const firstView = views[0]
      if (firstView) {
        setActiveId(firstView.id)
        tabRefs.current.get(firstView.id)?.focus()
      }
    } else if (e.key === "End") {
      e.preventDefault()
      const lastView = views[views.length - 1]
      if (lastView) {
        setActiveId(lastView.id)
        tabRefs.current.get(lastView.id)?.focus()
      }
    }
  }

  const dirtyActions = isDirty && activeView && (
    <div
      data-slot="saved-views-dirty-actions"
      className="flex items-center gap-1.5"
    >
      <Badge
        variant="outline"
        className="border-amber-300 text-amber-600 dark:border-amber-700 dark:text-amber-400"
      >
        Unsaved
      </Badge>
      {showReset && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 gap-1 px-2 text-xs"
          onClick={() => onReset?.(activeView)}
        >
          <RotateCcwIcon className="size-3.5" />
          Discard
        </Button>
      )}
      <Button
        type="button"
        size="sm"
        className="h-8 gap-1 px-2.5 text-xs shadow-xs"
        onClick={() => onSave?.(activeView)}
      >
        <SaveIcon className="size-3.5" />
        Save
      </Button>
    </div>
  )

  if (variant === "select") {
    return (
      <div
        data-slot="saved-views"
        className={cn("flex flex-wrap items-center gap-2", className)}
        {...props}
      >
        <Popover>
          <PopoverTrigger
            type="button"
            className="flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            aria-label={`${ariaLabel}: ${activeView?.name ?? "Select view"}`}
          >
            <span className="flex items-center gap-1.5 font-medium">
              {activeView?.isDefault && (
                <StarIcon
                  className="size-3.5 fill-amber-500 text-amber-500"
                  aria-hidden="true"
                />
              )}
              {activeView?.name ?? "Select view"}
            </span>
            {isDirty && (
              <span
                className="size-2 rounded-full bg-amber-500"
                aria-label="Unsaved changes"
              />
            )}
            <ChevronDownIcon className="size-4 opacity-50" />
          </PopoverTrigger>
          <PopoverContent align="start" className="w-56 p-1">
            <div className="space-y-0.5">
              {views.map((view) => {
                const isActive = view.id === activeId
                return (
                  <div
                    key={view.id}
                    className={cn(
                      "group flex items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground",
                      isActive && "bg-accent/60 font-medium"
                    )}
                  >
                    <button
                      type="button"
                      className="flex flex-1 items-center gap-2 text-left"
                      onClick={() => handleSelect(view.id)}
                    >
                      {isActive ? (
                        <CheckIcon className="size-3.5 text-primary" />
                      ) : (
                        <span className="size-3.5" />
                      )}
                      <span className="truncate">{view.name}</span>
                      {view.isDefault && (
                        <StarIcon
                          className="size-3 fill-amber-500 text-amber-500"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                    {(allowRename ||
                      allowDuplicate ||
                      allowSetDefault ||
                      allowDelete) && (
                      <ViewOptionsMenu
                        view={view}
                        isOnlyView={views.length <= 1}
                        allowRename={allowRename}
                        allowDuplicate={allowDuplicate}
                        allowSetDefault={allowSetDefault}
                        allowDelete={allowDelete}
                        onStartRename={() => handleStartRename(view)}
                        onDuplicate={() => handleDuplicate(view)}
                        onSetDefault={() => handleSetDefault(view.id)}
                        onDelete={() => handleDelete(view.id)}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            {allowCreate && (
              <>
                <div className="my-1 h-px bg-border" />
                <form
                  onSubmit={handleCreateSubmit}
                  className="flex items-center gap-1 p-1"
                >
                  <Input
                    size={1}
                    value={newViewName}
                    onChange={(e) => setNewViewName(e.target.value)}
                    placeholder={placeholder}
                    className="h-7 text-xs"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs"
                    disabled={!newViewName.trim()}
                  >
                    Add
                  </Button>
                </form>
              </>
            )}
          </PopoverContent>
        </Popover>

        {dirtyActions}
      </div>
    )
  }

  return (
    <div
      data-slot="saved-views"
      className={cn(
        "flex flex-wrap items-center justify-between gap-3",
        className
      )}
      {...props}
    >
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="flex max-w-full items-center gap-1 overflow-x-auto rounded-lg border bg-muted/40 p-1"
      >
        {views.map((view, index) => {
          const isActive = view.id === activeId
          const isEditing = editingId === view.id

          if (isEditing) {
            return (
              <form
                key={view.id}
                onSubmit={(e) => {
                  e.preventDefault()
                  handleRenameSubmit(view.id)
                }}
                className="flex items-center"
              >
                <Input
                  autoFocus
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={() => handleRenameSubmit(view.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      e.preventDefault()
                      setEditingId(null)
                    }
                  }}
                  className="h-7 w-28 px-2 py-0 text-xs md:text-xs"
                  aria-label="Rename view"
                />
              </form>
            )
          }

          return (
            <div
              key={view.id}
              className={cn(
                "group flex items-center rounded-md text-sm transition-colors",
                isActive
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
              )}
            >
              <button
                ref={(el) => {
                  if (el) tabRefs.current.set(view.id, el)
                  else tabRefs.current.delete(view.id)
                }}
                role="tab"
                type="button"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleSelect(view.id)}
                onDoubleClick={() => {
                  if (allowRename && !view.isLocked) {
                    handleStartRename(view)
                  }
                }}
                onKeyDown={(e) => handleTabKeyDown(e, index, view)}
                className="flex items-center gap-1.5 rounded-l-md px-2.5 py-1 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {view.isDefault && (
                  <StarIcon
                    className="size-3 fill-amber-500 text-amber-500"
                    aria-hidden="true"
                  />
                )}
                <span>{view.name}</span>
                {isActive && isDirty && (
                  <span
                    className="size-1.5 rounded-full bg-amber-500"
                    aria-label="Unsaved changes"
                  />
                )}
              </button>

              {(allowRename ||
                allowDuplicate ||
                allowSetDefault ||
                allowDelete) && (
                <ViewOptionsMenu
                  view={view}
                  isOnlyView={views.length <= 1}
                  allowRename={allowRename}
                  allowDuplicate={allowDuplicate}
                  allowSetDefault={allowSetDefault}
                  allowDelete={allowDelete}
                  onStartRename={() => handleStartRename(view)}
                  onDuplicate={() => handleDuplicate(view)}
                  onSetDefault={() => handleSetDefault(view.id)}
                  onDelete={() => handleDelete(view.id)}
                />
              )}
            </div>
          )
        })}

        {allowCreate && (
          <Popover open={createOpen} onOpenChange={setCreateOpen}>
            <PopoverTrigger
              type="button"
              className="flex size-7 items-center justify-center rounded-md border border-dashed border-muted-foreground/30 text-muted-foreground transition-colors outline-none hover:border-foreground hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Create new view"
            >
              <PlusIcon className="size-3.5" />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64 p-3">
              <form onSubmit={handleCreateSubmit} className="space-y-3">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Create new view</h4>
                  <p className="text-xs text-muted-foreground">
                    Save the current filters and configuration as a named view.
                  </p>
                </div>
                <Input
                  autoFocus
                  value={newViewName}
                  onChange={(e) => setNewViewName(e.target.value)}
                  placeholder={placeholder}
                  className="h-8 text-xs"
                />
                <div className="flex justify-end gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => setCreateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    disabled={!newViewName.trim()}
                  >
                    Create view
                  </Button>
                </div>
              </form>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {dirtyActions}
    </div>
  )
}

function ViewOptionsMenu({
  view,
  isOnlyView,
  allowRename,
  allowDuplicate,
  allowSetDefault,
  allowDelete,
  onStartRename,
  onDuplicate,
  onSetDefault,
  onDelete,
}: {
  view: SavedView
  isOnlyView: boolean
  allowRename: boolean
  allowDuplicate: boolean
  allowSetDefault: boolean
  allowDelete: boolean
  onStartRename: () => void
  onDuplicate: () => void
  onSetDefault: () => void
  onDelete: () => void
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        aria-label={`Options for ${view.name}`}
        className="flex size-6 items-center justify-center rounded-r-md px-1 text-muted-foreground opacity-70 transition-opacity outline-none hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-ring"
      >
        <MoreHorizontalIcon className="size-3" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-44 p-1">
        <div className="space-y-0.5 text-xs">
          {allowRename && !view.isLocked && (
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onStartRename()
              }}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left transition-colors outline-none hover:bg-accent hover:text-accent-foreground"
            >
              <PencilIcon className="size-3.5 text-muted-foreground" />
              Rename
            </button>
          )}

          {allowDuplicate && (
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onDuplicate()
              }}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left transition-colors outline-none hover:bg-accent hover:text-accent-foreground"
            >
              <CopyIcon className="size-3.5 text-muted-foreground" />
              Duplicate
            </button>
          )}

          {allowSetDefault && !view.isDefault && (
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onSetDefault()
              }}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left transition-colors outline-none hover:bg-accent hover:text-accent-foreground"
            >
              <StarIcon className="size-3.5 text-amber-500" />
              Set as default
            </button>
          )}

          {allowDelete && !view.isLocked && !isOnlyView && (
            <>
              <div className="my-1 h-px bg-border" />
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  onDelete()
                }}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-destructive transition-colors outline-none hover:bg-destructive/10"
              >
                <Trash2Icon className="size-3.5" />
                Delete
              </button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { SavedViews }
