import { Rating } from "@/registry/default/ui/rating"

export function RatingReadOnlyPreview() {
  return (
    <div className="flex items-center gap-2">
      <Rating aria-label="Average" defaultValue={4.5} step={0.5} readOnly />
      <span className="text-sm text-muted-foreground">
        4.5 from 212 reviews
      </span>
    </div>
  )
}
