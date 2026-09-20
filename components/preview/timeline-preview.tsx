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

const EVENTS = [
  {
    title: "Deployed to production",
    detail: "Noor Haddad rolled out v2.14.0 to 3 replicas.",
    time: "14:32",
    variant: "current",
  },
  {
    title: "Review approved",
    detail: "Tomasz Wierzba approved the release plan.",
    time: "13:58",
    variant: "success",
  },
  {
    title: "Health check failed",
    detail: "eu-west-1 returned 503 for 40 seconds.",
    time: "13:47",
    variant: "destructive",
  },
  {
    title: "Preview build passed",
    detail: "CI finished in 3m 12s.",
    time: "13:41",
    variant: "default",
  },
] as const

export function TimelinePreview() {
  return (
    <>
      <Timeline className="w-full max-w-md">
        {EVENTS.map((event) => (
          <TimelineItem key={event.title}>
            <TimelineIndicator variant={event.variant} />
            <TimelineContent>
              <TimelineHeader>
                <TimelineTitle>{event.title}</TimelineTitle>
                <TimelineTime>{event.time}</TimelineTime>
              </TimelineHeader>
              <TimelineDescription>{event.detail}</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </>
  )
}
