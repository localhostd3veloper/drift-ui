import { ArrowRightIcon, PlusIcon } from "lucide-react"

import { Button } from "@/registry/base/ui/button"

const BUTTON_VARIANTS = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const

export function ButtonPreview() {
  return (
    <>
      {BUTTON_VARIANTS.map((variant) => (
        <Button key={variant} variant={variant} className="capitalize">
          {variant}
        </Button>
      ))}
      <Button size="sm">
        Continue <ArrowRightIcon />
      </Button>
      <Button size="icon" variant="outline" aria-label="Add">
        <PlusIcon />
      </Button>
      <Button disabled>Disabled</Button>
    </>
  )
}
