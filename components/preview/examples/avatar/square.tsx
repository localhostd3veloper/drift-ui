import { Avatar, AvatarFallback } from "@/registry/default/ui/avatar"

export function AvatarSquarePreview() {
  return (
    <Avatar className="size-10 rounded-md">
      <AvatarFallback className="rounded-md">LL</AvatarFallback>
    </Avatar>
  )
}
