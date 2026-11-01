"use client"

import * as React from "react"

import { ImageCropper } from "@/registry/default/ui/image-cropper"

export function ImageCropperPreview() {
  const [croppedUrl, setCroppedUrl] = React.useState<string | null>(null)

  function handleCropComplete(blob: Blob) {
    const url = URL.createObjectURL(blob)
    setCroppedUrl(url)
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <ImageCropper
        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"
        aspect={1}
        cropShape="round"
        onCropComplete={handleCropComplete}
      />
      {croppedUrl && (
        <div className="flex items-center gap-3 rounded-md border p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={croppedUrl}
            alt="Cropped output"
            className="size-12 rounded-full border object-cover"
          />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Avatar crop complete</p>
            <p>Ready to upload as blob</p>
          </div>
        </div>
      )}
    </div>
  )
}
