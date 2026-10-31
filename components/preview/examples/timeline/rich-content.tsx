import { Badge } from "@/registry/default/ui/badge"
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

export function TimelineRichContentPreview() {
  return (
    <Timeline className="w-full max-w-md">
      <TimelineItem>
        <TimelineIndicator variant="success" />
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Refund approved</TimelineTitle>
            <TimelineTime>09:12</TimelineTime>
          </TimelineHeader>
          <TimelineDescription>
            Ilse Marchetti closed the case.
          </TimelineDescription>
          <div className="mt-2 flex gap-2">
            <Badge variant="secondary">Billing</Badge>
            <Badge variant="outline">$49.00</Badge>
          </div>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineIndicator />
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Comment added</TimelineTitle>
            <TimelineTime>08:47</TimelineTime>
          </TimelineHeader>
          <blockquote className="mt-2 border-l-2 pl-3 text-sm text-muted-foreground">
            The customer was charged twice for October.
          </blockquote>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}
