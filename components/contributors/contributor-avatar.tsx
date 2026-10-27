import Image from "next/image"

import { cn } from "@/registry/default/lib/utils"

export function ContributorAvatar({
  login,
  sizePx,
  className,
}: {
  login: string
  sizePx: number
  className?: string
}) {
  return (
    <Image
      src={`https://avatars.githubusercontent.com/${login}?s=${sizePx * 2}`}
      alt=""
      width={sizePx}
      height={sizePx}
      className={cn("shrink-0 rounded-full border bg-muted", className)}
    />
  )
}
