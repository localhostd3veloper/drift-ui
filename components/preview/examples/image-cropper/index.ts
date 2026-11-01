import { ImageCropperAvatarPreview } from "@/components/preview/examples/image-cropper/avatar"
import { ImageCropperBannerPreview } from "@/components/preview/examples/image-cropper/banner"
import { ImageCropperLandscapePreview } from "@/components/preview/examples/image-cropper/landscape"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "avatar",
    title: "Avatar circular crop",
    description:
      "Square 1:1 aspect ratio with a circular mask overlay for user profile photos.",
    Preview: ImageCropperAvatarPreview,
  },
  {
    id: "banner",
    title: "16:9 cover banner",
    description:
      "Widescreen 16:9 aspect ratio for profile covers and article headers.",
    Preview: ImageCropperBannerPreview,
  },
  {
    id: "landscape",
    title: "4:3 landscape framing",
    description:
      "Standard 4:3 photo aspect ratio for photography and card assets.",
    Preview: ImageCropperLandscapePreview,
  },
]
