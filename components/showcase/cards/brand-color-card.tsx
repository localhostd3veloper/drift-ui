"use client"

import * as React from "react"
import { FolderIcon, LayoutGridIcon, UsersIcon } from "lucide-react"

import { cn } from "@/registry/default/lib/utils"
import { Button } from "@/registry/default/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"
import { ColorPicker } from "@/registry/default/ui/color-picker"
import { Label } from "@/registry/default/ui/label"

const DEFAULT_ACCENT = "#6366f1"

const SWATCHES = [
  "#0f172a",
  "#64748b",
  "#ef4444",
  "#f59e0b",
  "#22c55e",
  "#06b6d4",
  "#6366f1",
  "#d946ef",
]

const NAV_ITEMS = [
  { label: "Overview", Icon: LayoutGridIcon },
  { label: "Projects", Icon: FolderIcon },
  { label: "Members", Icon: UsersIcon },
]

export function BrandColorCard() {
  const [accent, setAccent] = React.useState(DEFAULT_ACCENT)
  const [saved, setSaved] = React.useState(DEFAULT_ACCENT)
  const tint = `color-mix(in oklab, ${accent} 14%, transparent)`

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          The accent shows on links, active items and charts.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="brand-accent">Accent color</Label>
          <ColorPicker
            id="brand-accent"
            value={accent}
            onValueChange={setAccent}
            showAlpha={false}
            swatches={SWATCHES}
            className="w-32"
          />
        </div>
        <div
          aria-hidden
          className="grid grid-cols-[7rem_1fr] overflow-hidden rounded-lg border bg-background"
        >
          <ul className="flex flex-col gap-0.5 border-r bg-muted/40 p-2">
            {NAV_ITEMS.map(({ label, Icon }, index) => (
              <li
                key={label}
                style={index === 0 ? { backgroundColor: tint } : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground",
                  index === 0 && "font-medium text-foreground"
                )}
              >
                <Icon
                  className="size-3.5"
                  style={index === 0 ? { color: accent } : undefined}
                />
                {label}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Deploys</span>
              <span
                className="rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                style={{ backgroundColor: tint, color: accent }}
              >
                Live
              </span>
            </div>
            <div className="flex h-12 items-end gap-1">
              {[40, 65, 50, 85, 70, 100].map((height, index) => (
                <span
                  key={index}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${height}%`,
                    backgroundColor: index === 5 ? accent : tint,
                  }}
                />
              ))}
            </div>
            <span
              className="text-xs font-medium underline underline-offset-2"
              style={{ color: accent }}
            >
              View all releases
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2 border-t">
        <Button
          variant="ghost"
          size="sm"
          disabled={accent === DEFAULT_ACCENT}
          onClick={() => setAccent(DEFAULT_ACCENT)}
        >
          Reset
        </Button>
        <Button
          size="sm"
          disabled={accent === saved}
          onClick={() => setSaved(accent)}
        >
          Save changes
        </Button>
      </CardFooter>
    </Card>
  )
}
