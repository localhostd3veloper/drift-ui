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
import { Input } from "@/registry/default/ui/input"
import { Label } from "@/registry/default/ui/label"

export function CardPreview() {
  return (
    <>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>Deploy a new project in one click.</CardDescription>
          <CardAction>
            <Badge variant="outline">Beta</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="project-name">Name</Label>
            <Input id="project-name" placeholder="my-project" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-email">Owner email</Label>
            <Input
              id="project-email"
              type="email"
              defaultValue="not-an-email"
              aria-invalid
            />
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="ghost">Cancel</Button>
          <Button>Create</Button>
        </CardFooter>
      </Card>
    </>
  )
}
