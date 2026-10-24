"use client"

import * as React from "react"
import { BellIcon, PlusIcon } from "lucide-react"

import { Button } from "@/registry/default/ui/button"
import { Tour, TourTarget, type TourStep } from "@/registry/default/ui/tour"

const STEPS: TourStep[] = [
  {
    target: "landing-create",
    title: "Create a project",
    description: "Everything starts here.",
  },
  {
    target: "landing-alerts",
    title: "Deploy alerts",
    description: "Arrow keys move between steps. Escape ends the tour.",
  },
]

export function TourDemo() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Tour steps={STEPS} open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-md border px-3 py-2">
          <TourTarget name="landing-create">
            <Button size="sm" variant="secondary">
              <PlusIcon />
              New project
            </Button>
          </TourTarget>
          <TourTarget name="landing-alerts">
            <Button size="icon" variant="ghost" aria-label="Alerts">
              <BellIcon />
            </Button>
          </TourTarget>
        </div>
        <Button
          size="sm"
          onClick={() => setIsOpen(true)}
          className="self-start"
        >
          Start the tour
        </Button>
      </div>
    </Tour>
  )
}
