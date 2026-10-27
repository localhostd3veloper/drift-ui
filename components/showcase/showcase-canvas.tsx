import { PreviewCard } from "@/components/showcase/preview-card"
import {
  SHOWCASE_CARDS,
  UNSHOWCASED_ENTRIES,
} from "@/components/showcase/showcase-cards"

export function ShowcaseCanvas() {
  return (
    <div className="columns-1 gap-4 *:mb-4 *:break-inside-avoid @2xl:columns-2 @5xl:columns-3 @[90rem]:columns-4">
      {SHOWCASE_CARDS.map(({ id, Card }) => (
        <Card key={id} />
      ))}
      {UNSHOWCASED_ENTRIES.map((entry) => (
        <PreviewCard key={entry.slug} entry={entry} />
      ))}
    </div>
  )
}
