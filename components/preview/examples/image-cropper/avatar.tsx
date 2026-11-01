"use client"

import * as React from "react"

import { ImageCropper } from "@/registry/default/ui/image-cropper"

export function ImageCropperAvatarPreview() {
  return (
    <div className="w-full max-w-sm">
      <ImageCropper
        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"
        aspect={1}
        cropShape="round"
        aria-label="Avatar image cropper"
      />
    </div>
  )
}
