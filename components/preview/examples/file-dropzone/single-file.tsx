"use client"

import * as React from "react"

import {
  FileDropzone,
  FileDropzoneItem,
  FileDropzoneList,
} from "@/registry/default/ui/file-dropzone"

export function FileDropzoneSingleFilePreview() {
  const [file, setFile] = React.useState<File | null>(null)

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <FileDropzone
        accept=".csv"
        multiple={false}
        onFilesAccepted={([accepted]) => setFile(accepted)}
      />
      {file && (
        <FileDropzoneList>
          <FileDropzoneItem
            name={file.name}
            size={file.size}
            onRemove={() => setFile(null)}
          />
        </FileDropzoneList>
      )}
    </div>
  )
}
