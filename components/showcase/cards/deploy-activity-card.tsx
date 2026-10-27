import { Button } from "@/registry/default/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"
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

const DEPLOYS = [
  {
    title: "Promoted to production",
    detail: "v2.14.0 is live on 3 replicas.",
    actor: "Noor Haddad",
    time: "14:32",
    variant: "current",
  },
  {
    title: "Rolled back eu-west-1",
    detail: "Health checks returned 503 for 40s.",
    actor: "Auto rollback",
    time: "13:47",
    variant: "destructive",
  },
  {
    title: "Preview ready",
    detail: "feat/tax-rates built in 3m 12s.",
    actor: "Ilse Brandt",
    time: "13:41",
    variant: "default",
  },
  {
    title: "Staging deploy",
    detail: "Migration 0012 applied cleanly.",
    actor: "Tomasz Wierzba",
    time: "11:05",
    variant: "default",
  },
] as const

export function DeployActivityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deploy activity</CardTitle>
        <CardDescription>ledgerline-api, last 24 hours</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Timeline>
          {DEPLOYS.map((deploy) => (
            <TimelineItem key={deploy.title}>
              <TimelineIndicator variant={deploy.variant} />
              <TimelineContent>
                <TimelineHeader>
                  <TimelineTitle>{deploy.title}</TimelineTitle>
                  <TimelineTime>{deploy.time}</TimelineTime>
                </TimelineHeader>
                <TimelineDescription>{deploy.detail}</TimelineDescription>
                <span className="text-xs text-muted-foreground">
                  {deploy.actor}
                </span>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  )
}
