"use client"

import * as React from "react"
import { HeartIcon } from "lucide-react"

import { Rating } from "@/registry/default/ui/rating"

export function RatingPreview() {
  const [score, setScore] = React.useState(3.5)

  return (
    <div className="grid gap-4">
      <Rating
        aria-label="Your rating"
        value={score}
        onValueChange={setScore}
        step={0.5}
      />
      <Rating
        aria-label="Average"
        defaultValue={4}
        icon={<HeartIcon />}
        readOnly
        className="text-destructive"
      />
    </div>
  )
}
