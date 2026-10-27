"use client"

import * as React from "react"

import { Button } from "@/registry/default/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"
import {
  FileDropzone,
  FileDropzoneItem,
  FileDropzoneList,
  type FileRejection,
} from "@/registry/default/ui/file-dropzone"
import { Badge } from "@/registry/default/ui/badge"

const MAX_FILE_BYTES = 50 * 1024 * 1024
const MAX_FILES = 6

const REJECTION_MESSAGE: Record<FileRejection["reason"], string> = {
  type: "Use .zip, .dmg, .tar.gz or .txt",
  size: "Larger than 50 MB",
  count: "Release already has 6 assets",
}

type Asset = {
  id: string
  name: string
  size: number
  progress?: number
  error?: string
}

const SEEDED_ASSETS: Asset[] = [
  { id: "seed-1", name: "ledgerline-2.14.0-macos.dmg", size: 41_838_592 },
  {
    id: "seed-2",
    name: "ledgerline-2.14.0-linux.tar.gz",
    size: 28_311_552,
    progress: 72,
  },
  { id: "seed-3", name: "checksums.txt", size: 412 },
]

export function UploadAssetsCard() {
  const [assets, setAssets] = React.useState(SEEDED_ASSETS)
  const readyCount = assets.filter(
    (asset) => !asset.error && (asset.progress ?? 100) >= 100
  ).length

  function addAssets(files: File[], error?: string) {
    setAssets((previous) => [
      ...previous,
      ...files.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        error,
      })),
    ])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Release assets</CardTitle>
        <CardDescription>Binaries attached to v2.14.0</CardDescription>
        <CardAction>
          <Badge variant="outline" className="tabular-nums">
            {readyCount} ready
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <FileDropzone
          accept=".zip,.dmg,.gz,.txt"
          maxSize={MAX_FILE_BYTES}
          maxFiles={Math.max(MAX_FILES - assets.length, 0)}
          onFilesAccepted={(files) => addAssets(files)}
          onFilesRejected={(rejections) => {
            for (const rejection of rejections)
              addAssets([rejection.file], REJECTION_MESSAGE[rejection.reason])
          }}
          className="py-6"
        />
        <FileDropzoneList>
          {assets.map((asset) => (
            <FileDropzoneItem
              key={asset.id}
              name={asset.name}
              size={asset.size}
              progress={asset.progress}
              error={asset.error}
              onRemove={() =>
                setAssets((previous) =>
                  previous.filter((listed) => listed.id !== asset.id)
                )
              }
            />
          ))}
        </FileDropzoneList>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="ghost" size="sm">
          Save draft
        </Button>
        <Button size="sm" disabled={readyCount === 0}>
          Publish release
        </Button>
      </CardFooter>
    </Card>
  )
}
