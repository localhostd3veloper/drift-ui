import {
  Timeline,
  TimelineContent,
  TimelineIndicator,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@/registry/default/ui/timeline"

const EVENTS = [
  {
    title: "Deployed to production",
    meta: "Noor Haddad, 14:32",
    variant: "current",
  },
  {
    title: "Review approved",
    meta: "Tomasz Wierzba, 13:58",
    variant: "default",
  },
  { title: "Preview build passed", meta: "CI, 13:41", variant: "default" },
] as const

export function TimelineSpecimen({ className }: { className?: string }) {
  return (
    <Timeline className={className}>
      {EVENTS.map((event) => (
        <TimelineItem key={event.title} className="pb-4">
          <TimelineIndicator variant={event.variant} />
          <TimelineContent className="gap-0.5">
            <TimelineTitle className="text-xs">{event.title}</TimelineTitle>
            <TimelineTime className="text-[11px]">{event.meta}</TimelineTime>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
