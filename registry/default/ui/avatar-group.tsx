"use client"

import * as React from "react"

import { cn } from "@/registry/default/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover"

type AvatarStatus = "online" | "away" | "busy" | "offline"

type AvatarGroupItemProps = React.ComponentProps<"span"> & {
  src?: string
  name: string
  status?: AvatarStatus
}

const STATUS_CLASSES: Record<AvatarStatus, string> = {
  online: "bg-chart-2",
  away: "border-2 border-chart-2 bg-background",
  busy: "bg-destructive",
  offline: "bg-muted-foreground",
}

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}

function AvatarGroupItem({
  src,
  name,
  status,
  className,
  ...props
}: AvatarGroupItemProps) {
  return (
    <span
      data-slot="avatar-group-item"
      title={name}
      className={cn("relative inline-flex size-8 shrink-0", className)}
      {...props}
    >
      <Avatar aria-hidden className="size-full ring-2 ring-background">
        <AvatarImage src={src} alt="" />
        <AvatarFallback className="text-xs font-medium">
          {initialsOf(name)}
        </AvatarFallback>
      </Avatar>
      {status && (
        <span
          aria-hidden
          data-status={status}
          className={cn(
            "absolute right-0 bottom-0 size-2.5 rounded-full ring-2 ring-background",
            STATUS_CLASSES[status]
          )}
        />
      )}
      <span className="sr-only">{status ? `${name} (${status})` : name}</span>
    </span>
  )
}

function AvatarGroup({
  max,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { max?: number }) {
  const items = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<AvatarGroupItemProps> =>
      React.isValidElement(child)
  )
  const visible = max === undefined ? items : items.slice(0, max)
  const hidden = items.slice(visible.length)

  return (
    <div
      role="group"
      data-slot="avatar-group"
      className={cn("flex items-center -space-x-1.5", className)}
      {...props}
    >
      {visible.map((item, index) =>
        React.cloneElement(item, {
          style: { zIndex: visible.length - index, ...item.props.style },
        })
      )}
      {hidden.length > 0 && (
        <Popover>
          <PopoverTrigger
            data-slot="avatar-group-overflow"
            aria-label={`${hidden.length} more`}
            className="relative inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium ring-2 ring-background outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            +{hidden.length}
          </PopoverTrigger>
          <PopoverContent align="start" className="w-56 p-1">
            <ul className="grid max-h-64 overflow-y-auto">
              {hidden.map((item) => (
                <li
                  key={item.key}
                  className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm"
                >
                  {React.cloneElement(item, {
                    "aria-hidden": true,
                    className: cn(item.props.className, "size-7"),
                  })}
                  <span className="truncate">{item.props.name}</span>
                  {item.props.status && (
                    <span className="ml-auto text-xs text-muted-foreground capitalize">
                      {item.props.status}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

export { AvatarGroup, AvatarGroupItem, type AvatarStatus }
