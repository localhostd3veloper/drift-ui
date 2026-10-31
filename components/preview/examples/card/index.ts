import { CardListPreview } from "@/components/preview/examples/card/list"
import { CardStatPreview } from "@/components/preview/examples/card/stat"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "stat",
    title: "Stat card",
    description:
      "Leave out the parts you do not need. A title, a value and a footer make a dashboard metric.",
    Preview: CardStatPreview,
  },
  {
    id: "list",
    title: "List card",
    description:
      "CardContent takes any layout. Add a dividing list for settings or recent activity.",
    Preview: CardListPreview,
  },
]
