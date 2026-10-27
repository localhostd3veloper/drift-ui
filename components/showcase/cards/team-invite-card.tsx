"use client"

import * as React from "react"

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
import { Label } from "@/registry/default/ui/label"
import { TagsInput } from "@/registry/default/ui/tags-input"

const SEAT_LIMIT = 10

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const MEMBERS = [
  {
    name: "Noor Haddad",
    email: "noor@ledgerline.dev",
    role: "Owner",
    variant: "default",
  },
  {
    name: "Ilse Brandt",
    email: "ilse@ledgerline.dev",
    role: "Admin",
    variant: "secondary",
  },
  {
    name: "Tomas Reyes",
    email: "tomas@ledgerline.dev",
    role: "Member",
    variant: "outline",
  },
] as const

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
}

export function TeamInviteCard() {
  const [invites, setInvites] = React.useState([
    "mara@ledgerline.dev",
    "kenji@ledgerline.dev",
  ])
  const openSeats = SEAT_LIMIT - MEMBERS.length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite your team</CardTitle>
        <CardDescription>They get an email with a join link.</CardDescription>
        <CardAction>
          <Badge variant="outline" className="tabular-nums">
            {MEMBERS.length} of {SEAT_LIMIT} seats
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="team-invite-emails">Email addresses</Label>
          <TagsInput
            id="team-invite-emails"
            value={invites}
            onValueChange={setInvites}
            validate={(tag) => EMAIL_PATTERN.test(tag)}
            max={openSeats}
            addOnBlur
            placeholder="name@company.com"
          />
          <p className="text-xs text-muted-foreground">
            Paste a list or press Enter after each address.
          </p>
        </div>
        <ul className="flex flex-col divide-y rounded-md border">
          {MEMBERS.map((member) => (
            <li
              key={member.email}
              className="flex items-center gap-3 px-3 py-2"
            >
              <span
                aria-hidden
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground"
              >
                {initials(member.name)}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">
                  {member.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {member.email}
                </span>
              </span>
              <Badge variant={member.variant}>{member.role}</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="justify-between gap-4">
        <span className="text-xs text-muted-foreground">
          Invites join as Member
        </span>
        <Button
          size="sm"
          disabled={invites.length === 0}
          onClick={() => setInvites([])}
        >
          {invites.length === 1
            ? "Send 1 invite"
            : `Send ${invites.length} invites`}
        </Button>
      </CardFooter>
    </Card>
  )
}
