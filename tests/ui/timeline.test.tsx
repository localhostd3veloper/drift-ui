import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@/registry/default/ui/timeline"

describe("Timeline", () => {
  it("renders an ordered list of events with titles, times and descriptions", () => {
    render(
      <Timeline aria-label="Deploys">
        <TimelineItem>
          <TimelineIndicator variant="current" />
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>Deployed to production</TimelineTitle>
              <TimelineTime dateTime="2026-10-27T14:32">14:32</TimelineTime>
            </TimelineHeader>
            <TimelineDescription>v2.14.0 rolled out.</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineIndicator variant="destructive" />
          <TimelineContent>
            <TimelineTitle>Health check failed</TimelineTitle>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    )

    const list = screen.getByRole("list", { name: "Deploys" })
    expect(list.tagName).toBe("OL")
    expect(screen.getAllByRole("listitem")).toHaveLength(2)
    expect(screen.getByText("14:32")).toHaveAttribute(
      "datetime",
      "2026-10-27T14:32"
    )
    expect(screen.getByText("v2.14.0 rolled out.")).toHaveAttribute(
      "data-slot",
      "timeline-description"
    )
  })

  it("hides indicators from assistive tech and styles them by variant", () => {
    const { container } = render(
      <Timeline>
        <TimelineItem>
          <TimelineIndicator variant="current" />
        </TimelineItem>
        <TimelineItem>
          <TimelineIndicator />
        </TimelineItem>
      </Timeline>
    )

    const indicators = container.querySelectorAll(
      "[data-slot=timeline-indicator]"
    )
    expect(indicators[0]).toHaveAttribute("aria-hidden", "true")
    expect(indicators[0].firstElementChild).toHaveClass("bg-primary")
    expect(indicators[1].firstElementChild).toHaveClass("bg-muted-foreground")
  })

  it("forwards className through cn", () => {
    render(<TimelineTitle className="text-lg">Title</TimelineTitle>)
    expect(screen.getByText("Title")).toHaveClass("text-lg", "font-medium")
  })
})
