"use client"

import * as React from "react"

import { Button } from "@/registry/default/ui/button"
import { Tour, TourTarget, type TourStep } from "@/registry/default/ui/tour"

const STEPS: TourStep[] = [
  { target: "invite", title: "Invite your team" },
  { target: "billing", title: "Add a payment method", side: "top" },
]

export function TourOnCompletePreview() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isComplete, setIsComplete] = React.useState(false)

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Tour
        steps={STEPS}
        open={isOpen}
        onOpenChange={setIsOpen}
        onComplete={() => setIsComplete(true)}
      >
        <div className="flex gap-2">
          <TourTarget name="invite">
            <Button variant="outline">Invite</Button>
          </TourTarget>
          <TourTarget name="billing">
            <Button variant="outline">Billing</Button>
          </TourTarget>
        </div>
        <Button onClick={() => setIsOpen(true)}>Start tour</Button>
      </Tour>
      <p className="text-sm text-muted-foreground">
        {isComplete ? "Tour finished" : "Tour not finished yet"}
      </p>
    </div>
  )
}
