import { Avatar, AvatarFallback } from "@/registry/base/ui/avatar"

export function AvatarSquarePreview() {
  return (
    <Avatar className="size-10 rounded-md">
      <AvatarFallback className="rounded-md">LL</AvatarFallback>
    </Avatar>
  )
}
