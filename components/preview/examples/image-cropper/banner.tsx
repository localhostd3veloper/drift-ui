"use client"

import * as React from "react"

import { ImageCropper } from "@/registry/default/ui/image-cropper"

export function ImageCropperBannerPreview() {
  return (
    <div className="w-full max-w-md">
      <ImageCropper
        src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1000&auto=format&fit=crop&q=80"
        aspect={16 / 9}
        aria-label="Cover banner cropper"
      />
    </div>
  )
}
