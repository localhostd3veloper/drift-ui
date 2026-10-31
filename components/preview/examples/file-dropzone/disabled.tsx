import { FileDropzone } from "@/registry/default/ui/file-dropzone"

export function FileDropzoneDisabledPreview() {
  return (
    <div className="w-full max-w-md">
      <FileDropzone disabled />
    </div>
  )
}
