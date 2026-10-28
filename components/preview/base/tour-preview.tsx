"use client"

import * as React from "react"
import { BellIcon, SearchIcon } from "lucide-react"

import { Button } from "@/registry/base/ui/button"
import { Input } from "@/registry/default/ui/input"
import { Tour, TourTarget, type TourStep } from "@/registry/base/ui/tour"

const STEPS: TourStep[] = [
  {
    target: "search",
    title: "Search everything",
    description: "Find projects, people and settings from one place.",
  },
  {
    target: "notifications",
    title: "Stay in the loop",
    description: "Mentions and deploy alerts land here.",
    side: "left",
  },
  {
    target: "create",
    title: "Start a project",
    description: "Use the arrow keys to move between steps.",
    side: "top",
  },
]

export function TourPreview() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      <Tour steps={STEPS} open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center gap-2">
          <TourTarget name="search">
            <div className="relative flex-1">
              <SearchIcon className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
              <Input
                aria-label="Search"
                placeholder="Search"
                className="pl-8"
              />
            </div>
          </TourTarget>
          <TourTarget name="notifications">
            <Button variant="outline" size="icon" aria-label="Notifications">
              <BellIcon />
            </Button>
          </TourTarget>
        </div>
        <div className="flex items-center justify-between">
          <TourTarget name="create">
            <Button variant="secondary">New project</Button>
          </TourTarget>
          <Button onClick={() => setIsOpen(true)}>Start tour</Button>
        </div>
      </Tour>
    </>
  )
}
