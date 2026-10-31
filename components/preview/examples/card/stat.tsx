import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/registry/default/ui/card"

export function CardStatPreview() {
  return (
    <Card className="w-full max-w-60">
      <CardHeader>
        <CardDescription>Monthly revenue</CardDescription>
      </CardHeader>
      <CardContent className="text-3xl font-medium tabular-nums">
        $48,210
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Up 12% from September
      </CardFooter>
    </Card>
  )
}
