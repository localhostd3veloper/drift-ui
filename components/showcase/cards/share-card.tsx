"use client"

import * as React from "react"
import { CheckIcon, CopyIcon, Share2Icon } from "lucide-react"

import { cn } from "@/registry/default/lib/utils"
import { Badge } from "@/registry/default/ui/badge"
import { Button } from "@/registry/default/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"
import { Input } from "@/registry/default/ui/input"
import { Label } from "@/registry/default/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover"

const SHARE_LINK = "https://app.ledgerline.dev/p/billing-redesign"

const ACCESS_LEVELS = ["Can view", "Can comment", "Can edit"]

const MEMBERS = [
  { name: "Noor Haddad", email: "noor@ledgerline.dev", role: "Owner" },
  { name: "Kofi Mensah", email: "kofi@ledgerline.dev", role: "Editor" },
  { name: "Ilse Marchetti", email: "ilse@ledgerline.dev", role: "Viewer" },
]

export function ShareCard() {
  const [access, setAccess] = React.useState(ACCESS_LEVELS[0])
  const [isCopied, setIsCopied] = React.useState(false)

  async function copyLink() {
    await navigator.clipboard.writeText(SHARE_LINK)
    setIsCopied(true)
    window.setTimeout(() => setIsCopied(false), 1500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing redesign</CardTitle>
        <CardDescription>3 people have access</CardDescription>
        <CardAction>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Share2Icon />
                Share
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <div className="grid gap-4">
                <div className="grid gap-1">
                  <p className="text-sm font-medium">Share project</p>
                  <p className="text-xs text-muted-foreground">
                    Anyone at ledgerline.dev with the link.
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="share-link">Link</Label>
                  <div className="flex gap-2">
                    <Input
                      id="share-link"
                      readOnly
                      value={SHARE_LINK}
                      className="h-8 font-mono text-xs"
                      onFocus={(event) => event.currentTarget.select()}
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={copyLink}
                      aria-label={isCopied ? "Link copied" : "Copy link"}
                    >
                      {isCopied ? <CheckIcon /> : <CopyIcon />}
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label id="share-access-label">Access</Label>
                  <div
                    role="group"
                    aria-labelledby="share-access-label"
                    className="grid grid-cols-3 gap-1 rounded-md bg-muted p-1"
                  >
                    {ACCESS_LEVELS.map((level) => (
                      <button
                        key={level}
                        type="button"
                        aria-pressed={access === level}
                        onClick={() => setAccess(level)}
                        className={cn(
                          "rounded-sm px-2 py-1 text-xs font-medium text-muted-foreground transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                          access === level &&
                            "bg-background text-foreground shadow-xs"
                        )}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {MEMBERS.map((member) => (
            <li key={member.email} className="flex items-center gap-3">
              <span
                aria-hidden
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground"
              >
                {member.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">
                  {member.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {member.email}
                </span>
              </div>
              <Badge
                variant={member.role === "Owner" ? "secondary" : "outline"}
              >
                {member.role}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
