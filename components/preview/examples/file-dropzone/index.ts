import { FileDropzoneDisabledPreview } from "@/components/preview/examples/file-dropzone/disabled"
import { FileDropzoneSingleFilePreview } from "@/components/preview/examples/file-dropzone/single-file"
import { FileDropzoneUploadStatesPreview } from "@/components/preview/examples/file-dropzone/upload-states"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "single-file",
    title: "One file",
    description:
      "multiple={false} limits the picker to one file, for an avatar or a CSV import.",
    Preview: FileDropzoneSingleFilePreview,
  },
  {
    id: "upload-states",
    title: "Upload states",
    description:
      "FileDropzoneItem shows a bar while progress is below 100 and marks the row invalid when error is set. Your upload code owns both values.",
    Preview: FileDropzoneUploadStatesPreview,
  },
  {
    id: "disabled",
    title: "Disabled",
    description:
      "disabled ignores drops and clicks, for example while an upload runs.",
    Preview: FileDropzoneDisabledPreview,
  },
]
