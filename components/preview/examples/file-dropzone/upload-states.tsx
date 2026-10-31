import {
  FileDropzoneItem,
  FileDropzoneList,
} from "@/registry/default/ui/file-dropzone"

export function FileDropzoneUploadStatesPreview() {
  return (
    <FileDropzoneList className="w-full max-w-md">
      <FileDropzoneItem name="contract.pdf" size={1_240_000} />
      <FileDropzoneItem name="team-photo.png" size={3_480_000} progress={64} />
      <FileDropzoneItem
        name="archive.zip"
        size={82_000_000}
        error="Larger than 5 MB"
      />
    </FileDropzoneList>
  )
}
