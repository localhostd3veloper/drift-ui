import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@/registry/default/ui/timeline"

const EVENTS = [
  { title: "Invoice paid", time: "Oct 30" },
  { title: "Invoice sent", time: "Oct 24" },
  { title: "Draft created", time: "Oct 21" },
]

export function TimelineCompactPreview() {
  return (
    <Timeline className="w-full max-w-sm">
      {EVENTS.map((event) => (
        <TimelineItem key={event.title}>
          <TimelineIndicator />
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>{event.title}</TimelineTitle>
              <TimelineTime>{event.time}</TimelineTime>
            </TimelineHeader>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
