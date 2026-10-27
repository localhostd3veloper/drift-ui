"use client"

import * as React from "react"
import { GitPullRequestIcon, KeyboardIcon, SparklesIcon } from "lucide-react"

import { Badge } from "@/registry/default/ui/badge"
import { Button } from "@/registry/default/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"
import { Tour, TourTarget, type TourStep } from "@/registry/default/ui/tour"

const UPDATES = [
  {
    target: "previews",
    title: "Preview branches",
    detail: "Every pull request gets its own database branch.",
    Icon: GitPullRequestIcon,
  },
  {
    target: "shortcuts",
    title: "Command menu",
    detail: "Press Cmd K to jump to any project or setting.",
    Icon: KeyboardIcon,
  },
  {
    target: "insights",
    title: "Usage insights",
    detail: "See which endpoints drive your monthly bill.",
    Icon: SparklesIcon,
  },
]

const STEPS: TourStep[] = [
  {
    target: "previews",
    title: "Preview branches",
    description: "Open a pull request and a seeded branch spins up in seconds.",
  },
  {
    target: "shortcuts",
    title: "Command menu",
    description: "Search projects, members and settings without the mouse.",
  },
  {
    target: "insights",
    title: "Usage insights",
    description: "Spot expensive endpoints before the invoice does.",
    side: "top",
  },
]

export function ProductTourCard() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>What&apos;s new</CardTitle>
        <CardDescription>Shipped in October</CardDescription>
        <CardAction>
          <Badge variant="secondary">3 updates</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Tour steps={STEPS} open={isOpen} onOpenChange={setIsOpen}>
          <ul className="flex flex-col gap-2">
            {UPDATES.map(({ target, title, detail, Icon }) => (
              <TourTarget key={target} name={target}>
                <li className="flex items-start gap-3 rounded-md border p-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Icon className="size-4 text-muted-foreground" />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">{title}</span>
                    <span className="text-xs text-muted-foreground">
                      {detail}
                    </span>
                  </div>
                </li>
              </TourTarget>
            ))}
          </ul>
        </Tour>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <Button variant="ghost" size="sm">
          Changelog
        </Button>
        <Button size="sm" onClick={() => setIsOpen(true)}>
          Take the tour
        </Button>
      </CardFooter>
    </Card>
  )
}
