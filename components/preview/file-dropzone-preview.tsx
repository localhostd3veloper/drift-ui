"use client"

import * as React from "react"

import {
  FileDropzone,
  FileDropzoneItem,
  FileDropzoneList,
  type FileRejection,
} from "@/registry/default/ui/file-dropzone"

const MAX_FILE_BYTES = 5 * 1024 * 1024

const REJECTION_MESSAGE: Record<FileRejection["reason"], string> = {
  type: "Only PDF and PNG files are allowed",
  size: "Larger than 5 MB",
  count: "Too many files",
}

type ListedFile = { id: string; name: string; size: number; error?: string }

export function FileDropzonePreview() {
  const [files, setFiles] = React.useState<ListedFile[]>([
    { id: "seed", name: "brand-guidelines.pdf", size: 2_516_582 },
  ])

  function listFiles(incoming: File[], error?: (file: File) => string) {
    setFiles((previous) => [
      ...previous,
      ...incoming.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        error: error?.(file),
      })),
    ])
  }

  return (
    <>
      <div className="flex w-full max-w-md flex-col gap-3">
        <FileDropzone
          accept=".pdf,image/png"
          maxSize={MAX_FILE_BYTES}
          onFilesAccepted={(accepted) => listFiles(accepted)}
          onFilesRejected={(rejections) => {
            for (const rejection of rejections)
              listFiles(
                [rejection.file],
                () => REJECTION_MESSAGE[rejection.reason]
              )
          }}
        />
        <FileDropzoneList>
          {files.map((file) => (
            <FileDropzoneItem
              key={file.id}
              name={file.name}
              size={file.size}
              error={file.error}
              onRemove={() =>
                setFiles((previous) =>
                  previous.filter((listed) => listed.id !== file.id)
                )
              }
            />
          ))}
          <FileDropzoneItem
            name="q3-roadmap.png"
            size={880_640}
            progress={64}
          />
        </FileDropzoneList>
      </div>
    </>
  )
}
