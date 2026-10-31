import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"

const SESSIONS = ["MacBook Pro, Berlin", "iPhone 16, Berlin", "Chrome, Mumbai"]

export function CardListPreview() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Active sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y text-sm">
          {SESSIONS.map((session) => (
            <li key={session} className="py-2">
              {session}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
