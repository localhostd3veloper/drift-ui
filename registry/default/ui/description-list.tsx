"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { useCopyToClipboard } from "@/registry/default/hooks/use-copy-to-clipboard"
import { cn } from "@/registry/default/lib/utils"
import { InlineEdit } from "@/registry/default/ui/inline-edit"

function DescriptionList({ className, ...props }: React.ComponentProps<"dl">) {
  return (
    <dl
      data-slot="description-list"
      className={cn(
        "grid grid-cols-[minmax(6rem,auto)_1fr] gap-x-6 text-sm",
        className
      )}
      {...props}
    />
  )
}

function DescriptionItem({
  label,
  copyable = false,
  editable = false,
  onValueChange,
  placeholder,
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  label: React.ReactNode
  copyable?: boolean
  editable?: boolean
  onValueChange?: (value: string) => void | Promise<void>
  placeholder?: string
}) {
  const { copied, copy } = useCopyToClipboard()
  const valueRef = React.useRef<HTMLDivElement>(null)
  const labelText = typeof label === "string" ? label : undefined

  return (
    <div
      data-slot="description-item"
      className={cn(
        "col-span-2 grid min-h-11 grid-cols-subgrid items-center border-b py-1.5 last:border-b-0",
        className
      )}
      {...props}
    >
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="flex min-w-0 items-center gap-1">
        <div ref={valueRef} className="min-w-0 flex-1 break-words">
          {editable ? (
            <InlineEdit
              aria-label={labelText}
              value={typeof children === "string" ? children : ""}
              placeholder={placeholder}
              onSave={onValueChange ?? (() => {})}
            />
          ) : (
            children
          )}
        </div>
        {copyable && (
          <button
            type="button"
            data-slot="description-item-copy"
            aria-label={labelText ? `Copy ${labelText}` : "Copy"}
            onClick={() =>
              copy(
                typeof children === "string"
                  ? children
                  : (valueRef.current?.textContent ?? "")
              )
            }
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-3.5"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
        )}
        {copyable && (
          <span role="status" className="sr-only">
            {copied ? "Copied" : ""}
          </span>
        )}
      </dd>
    </div>
  )
}

export { DescriptionItem, DescriptionList }
