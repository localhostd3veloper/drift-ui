import { Rating } from "@/registry/default/ui/rating"

export function RatingMaxPreview() {
  return <Rating aria-label="Likely to recommend" max={10} defaultValue={7} />
}
