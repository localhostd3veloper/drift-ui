import { Avatar, AvatarFallback, AvatarImage } from "@/registry/base/ui/avatar"

const SIZES = ["size-6", "size-8", "size-12", "size-16"]

export function AvatarSizesPreview() {
  return (
    <div className="flex items-center gap-3">
      {SIZES.map((size) => (
        <Avatar key={size} className={size}>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ))}
    </div>
  )
}
