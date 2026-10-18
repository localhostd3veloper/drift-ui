import { cn } from "@/registry/default/lib/utils"
import { PREVIEWS } from "@/components/docs/preview-registry"
import type { CatalogEntry } from "@/lib/catalog"

export function PreviewStage({
  entry,
  className,
}: {
  entry: CatalogEntry
  className?: string
}) {
  const Preview = PREVIEWS[entry.slug]
  if (!Preview) return null

  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-center justify-center gap-3",
        entry.stageClassName,
        className
      )}
    >
      <Preview />
    </div>
  )
}
