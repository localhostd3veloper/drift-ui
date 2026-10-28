import { cn } from "@/registry/default/lib/utils"
import { BASE_UI_PREVIEWS, PREVIEWS } from "@/components/docs/preview-registry"
import type { CatalogEntry } from "@/lib/catalog"
import type { PrimitiveLibrary } from "@/lib/primitive-library"

export function PreviewStage({
  entry,
  library = "radix",
  className,
}: {
  entry: CatalogEntry
  library?: PrimitiveLibrary
  className?: string
}) {
  const Preview =
    (library === "base" && BASE_UI_PREVIEWS[entry.slug]) || PREVIEWS[entry.slug]
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
