"use client"

import * as React from "react"
import { ArchiveIcon, TagIcon, Trash2Icon } from "lucide-react"

import {
  BulkActionBar,
  BulkActionBarButton,
} from "@/registry/base/ui/bulk-action-bar"

const FILES = [
  "q3-roadmap.png",
  "brand-guidelines.pdf",
  "invoice-0412.pdf",
  "onboarding-flow.fig",
]

export function BulkActionBarPreview() {
  const [selectedFiles, setSelectedFiles] = React.useState<string[]>([])
  const clearSelection = React.useCallback(() => setSelectedFiles([]), [])

  function toggleFile(file: string) {
    setSelectedFiles((current) =>
      current.includes(file)
        ? current.filter((selected) => selected !== file)
        : [...current, file]
    )
  }

  return (
    <>
      <ul className="divide-y rounded-md border text-sm">
        {FILES.map((file) => (
          <li key={file}>
            <label className="flex items-center gap-3 px-3 py-2">
              <input
                type="checkbox"
                checked={selectedFiles.includes(file)}
                onChange={() => toggleFile(file)}
                className="size-4 accent-primary"
              />
              {file}
            </label>
          </li>
        ))}
      </ul>
      <BulkActionBar
        placement="container"
        selectedCount={selectedFiles.length}
        onClear={clearSelection}
      >
        <BulkActionBarButton>
          <TagIcon />
          Label
        </BulkActionBarButton>
        <BulkActionBarButton>
          <ArchiveIcon />
          Archive
        </BulkActionBarButton>
        <BulkActionBarButton
          onClick={clearSelection}
          className="text-destructive hover:text-destructive"
        >
          <Trash2Icon />
          Delete
        </BulkActionBarButton>
      </BulkActionBar>
    </>
  )
}
