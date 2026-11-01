import { SignaturePadDisabledPreview } from "@/components/preview/examples/signature-pad/disabled"
import { SignaturePadPenColorPreview } from "@/components/preview/examples/signature-pad/pen-color"
import { SignaturePadPngPreview } from "@/components/preview/examples/signature-pad/png"
import { SignaturePadSavedPreview } from "@/components/preview/examples/signature-pad/saved"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "png",
    title: "PNG export",
    description:
      'format="png" emits a transparent PNG data URL at twice the pad size instead of SVG markup.',
    Preview: SignaturePadPngPreview,
  },
  {
    id: "pen-color",
    title: "Pen color",
    description: "penColor accepts any CSS color, including theme variables.",
    Preview: SignaturePadPenColorPreview,
  },
  {
    id: "saved",
    title: "Saved signature",
    description:
      "A value the pad did not draw is shown as an image. Clear removes it so the signer can start again.",
    Preview: SignaturePadSavedPreview,
  },
  {
    id: "disabled",
    title: "Disabled",
    description: "disabled dims the pad and ignores pointer input.",
    Preview: SignaturePadDisabledPreview,
  },
]
