"use client"

import * as React from "react"
import { FileIcon, UploadIcon, XIcon } from "lucide-react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/registry/default/lib/utils"

type FileRejectionReason = "type" | "size" | "count"

type FileRejection = {
  file: File
  reason: FileRejectionReason
}

const BYTE_UNITS = ["B", "KB", "MB", "GB"]

function formatBytes(bytes: number) {
  const exponent = Math.min(
    Math.floor(Math.log(Math.max(bytes, 1)) / Math.log(1024)),
    BYTE_UNITS.length - 1
  )
  const amount = bytes / 1024 ** exponent
  return `${amount.toFixed(exponent === 0 || amount >= 10 ? 0 : 1)} ${BYTE_UNITS[exponent]}`
}

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true

  return accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .some((token) => {
      if (token.startsWith(".")) return file.name.toLowerCase().endsWith(token)
      if (token.endsWith("/*")) return file.type.startsWith(token.slice(0, -1))
      return file.type === token
    })
}

type FileLimits = { accept?: string; maxSize?: number; maxFiles?: number }

function rejectionReasonFor(
  file: File,
  acceptedCount: number,
  { accept, maxSize, maxFiles }: FileLimits
): FileRejectionReason | null {
  if (!matchesAccept(file, accept)) return "type"
  if (maxSize !== undefined && file.size > maxSize) return "size"
  if (maxFiles !== undefined && acceptedCount >= maxFiles) return "count"
  return null
}

function partitionFiles(files: File[], limits: FileLimits) {
  const accepted: File[] = []
  const rejected: FileRejection[] = []

  for (const file of files) {
    const reason = rejectionReasonFor(file, accepted.length, limits)
    if (reason) rejected.push({ file, reason })
    else accepted.push(file)
  }

  return { accepted, rejected }
}

function FileDropzone({
  accept,
  maxSize,
  maxFiles,
  multiple = true,
  disabled,
  onFilesAccepted,
  onFilesRejected,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"label">, "onDrop"> & {
  accept?: string
  maxSize?: number
  maxFiles?: number
  multiple?: boolean
  disabled?: boolean
  onFilesAccepted?: (files: File[]) => void
  onFilesRejected?: (rejections: FileRejection[]) => void
}) {
  const [isDragging, setIsDragging] = React.useState(false)

  function receiveFiles(fileList: FileList | null) {
    if (!fileList || disabled) return
    const files = multiple
      ? Array.from(fileList)
      : Array.from(fileList).slice(0, 1)
    const { accepted, rejected } = partitionFiles(files, {
      accept,
      maxSize,
      maxFiles,
    })
    if (accepted.length > 0) onFilesAccepted?.(accepted)
    if (rejected.length > 0) onFilesRejected?.(rejected)
  }

  return (
    <label
      data-slot="file-dropzone"
      data-dragging={isDragging ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      onDragEnter={(event) => {
        event.preventDefault()
        if (!disabled) setIsDragging(true)
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setIsDragging(false)
      }}
      onDrop={(event) => {
        event.preventDefault()
        setIsDragging(false)
        receiveFiles(event.dataTransfer.files)
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input px-6 py-8 text-center transition-[color,background-color,border-color,box-shadow]",
        "hover:bg-accent/40 has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-[3px] has-[input:focus-visible]:ring-ring/50",
        "data-[dragging]:border-primary data-[dragging]:bg-accent",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <input
        type="file"
        className="sr-only"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(event) => {
          receiveFiles(event.target.files)
          event.target.value = ""
        }}
      />
      {children ?? (
        <>
          <span className="flex size-10 items-center justify-center rounded-full border bg-background text-muted-foreground [&_svg]:size-4">
            <UploadIcon />
          </span>
          <span className="text-sm font-medium">
            Drop files or{" "}
            <span className="underline underline-offset-4">browse</span>
          </span>
          {maxSize !== undefined && (
            <span className="text-xs text-muted-foreground">
              Up to {formatBytes(maxSize)} each
            </span>
          )}
        </>
      )}
    </label>
  )
}

function FileDropzoneList({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="file-dropzone-list"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function FileDropzoneItem({
  name,
  size,
  progress,
  error,
  onRemove,
  className,
  ...props
}: Omit<React.ComponentProps<"li">, "children"> & {
  name: string
  size: number
  progress?: number
  error?: string
  onRemove?: () => void
}) {
  const isUploading = progress !== undefined && progress < 100 && !error

  return (
    <li
      data-slot="file-dropzone-item"
      data-invalid={error ? "" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md border px-3 py-2.5 data-[invalid]:border-destructive/50",
        className
      )}
      {...props}
    >
      <FileIcon className="size-4 shrink-0 text-muted-foreground" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-3 text-sm">
          <span className="truncate">{name}</span>
          <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
            {isUploading ? `${Math.round(progress)}%` : formatBytes(size)}
          </span>
        </div>
        {isUploading && (
          <ProgressPrimitive.Root
            value={progress}
            aria-label={`Uploading ${name}`}
            className="h-1 overflow-hidden rounded-full bg-muted"
          >
            <ProgressPrimitive.Indicator
              className="h-full bg-primary transition-transform duration-300"
              style={{ transform: `translateX(-${100 - progress}%)` }}
            />
          </ProgressPrimitive.Root>
        )}
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>
      {onRemove && (
        <button
          type="button"
          aria-label={`Remove ${name}`}
          onClick={onRemove}
          className="rounded-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <XIcon className="size-4" />
        </button>
      )}
    </li>
  )
}

export {
  FileDropzone,
  FileDropzoneList,
  FileDropzoneItem,
  formatBytes,
  type FileRejection,
  type FileRejectionReason,
}
