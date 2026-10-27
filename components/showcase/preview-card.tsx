import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"
import { PreviewStage } from "@/components/docs/preview-stage"
import type { CatalogEntry } from "@/lib/catalog"

export function PreviewCard({ entry }: { entry: CatalogEntry }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link href={`/components/${entry.slug}`} className="hover:underline">
            {entry.name}
          </Link>
        </CardTitle>
        <CardDescription>{entry.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <PreviewStage entry={entry} />
      </CardContent>
    </Card>
  )
}
