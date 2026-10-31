import { Rating } from "@/registry/default/ui/rating"

export function RatingDisabledPreview() {
  return <Rating aria-label="Rate this order" defaultValue={3} disabled />
}
