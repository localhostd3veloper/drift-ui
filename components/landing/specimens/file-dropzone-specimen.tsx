import { cn } from "@/registry/default/lib/utils"
import {
  FileDropzone,
  FileDropzoneItem,
  FileDropzoneList,
} from "@/registry/default/ui/file-dropzone"

const MAX_FILE_BYTES = 20 * 1024 * 1024

export function FileDropzoneSpecimen({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <FileDropzone
        accept=".pdf,image/png"
        maxSize={MAX_FILE_BYTES}
        className="py-5"
      />
      <FileDropzoneList>
        <FileDropzoneItem
          name="brand-guidelines.pdf"
          size={2_516_582}
          progress={64}
        />
      </FileDropzoneList>
    </div>
  )
}
