"use client"

import * as React from "react"

import { Badge } from "@/registry/default/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"
import { InlineEdit } from "@/registry/default/ui/inline-edit"

const SIMULATED_SAVE_MS = 500
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

function wait() {
  return new Promise((resolve) => setTimeout(resolve, SIMULATED_SAVE_MS))
}

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "W"
  )
}

export function WorkspaceNameCard() {
  const [name, setName] = React.useState("Ledgerline")
  const [slug, setSlug] = React.useState("ledgerline")
  const [billingEmail, setBillingEmail] = React.useState(
    "finance@ledgerline.dev"
  )
  const [website, setWebsite] = React.useState("")

  async function saveSlug(next: string) {
    await wait()
    if (!SLUG_PATTERN.test(next)) throw new Error("Invalid slug")
    setSlug(next)
  }

  async function saveName(next: string) {
    await wait()
    setName(next)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace</CardTitle>
        <CardDescription>Click a field to edit. Enter saves.</CardDescription>
        <CardAction>
          <Badge variant="outline">Owner</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
          >
            {initials(name)}
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">
              {name || "Untitled workspace"}
            </span>
            <span className="truncate font-mono text-xs text-muted-foreground">
              app.ledgerline.dev/{slug}
            </span>
          </div>
        </div>
        <dl className="grid grid-cols-[6rem_1fr] items-center gap-x-4 gap-y-1 text-sm">
          <dt className="text-muted-foreground">Name</dt>
          <dd className="min-w-0">
            <InlineEdit
              aria-label="Workspace name"
              value={name}
              onSave={saveName}
            />
          </dd>
          <dt className="text-muted-foreground">URL slug</dt>
          <dd className="min-w-0">
            <InlineEdit aria-label="URL slug" value={slug} onSave={saveSlug} />
          </dd>
          <dt className="text-muted-foreground">Billing email</dt>
          <dd className="min-w-0">
            <InlineEdit
              aria-label="Billing email"
              value={billingEmail}
              onSave={setBillingEmail}
            />
          </dd>
          <dt className="text-muted-foreground">Website</dt>
          <dd className="min-w-0">
            <InlineEdit
              aria-label="Website"
              value={website}
              placeholder="Add a URL"
              onSave={setWebsite}
            />
          </dd>
        </dl>
      </CardContent>
      <CardFooter className="border-t">
        <p className="text-xs text-muted-foreground">
          Slugs use lowercase letters, numbers and single hyphens.
        </p>
      </CardFooter>
    </Card>
  )
}
