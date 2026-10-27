"use client"

import * as React from "react"

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
import { MentionTextarea } from "@/registry/default/ui/mention-textarea"

const TEAMMATES = {
  "@": [
    { value: "noor", label: "Noor Haddad", description: "Platform" },
    { value: "kofi", label: "Kofi Mensah", description: "Design" },
    { value: "ilse", label: "Ilse Marchetti", description: "Support" },
    { value: "tomasz", label: "Tomasz Wierzba", description: "Billing" },
  ],
}

type Comment = { id: string; author: string; time: string; body: string }

const THREAD: Comment[] = [
  {
    id: "c1",
    author: "Kofi Mensah",
    time: "2h ago",
    body: "Updated the invoice empty state. @noor can we ship it behind the billing flag?",
  },
  {
    id: "c2",
    author: "Noor Haddad",
    time: "48m ago",
    body: "Flag is on for internal accounts. Rolling to 10% after standup.",
  },
]

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
}

export function CommentCard() {
  const [comments, setComments] = React.useState(THREAD)
  const [draft, setDraft] = React.useState("")
  const canPost = draft.trim().length > 0

  function post() {
    if (!canPost) return
    setComments((previous) => [
      ...previous,
      {
        id: `c${previous.length + 1}`,
        author: "Ilse Marchetti",
        time: "Just now",
        body: draft.trim(),
      },
    ])
    setDraft("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice empty state</CardTitle>
        <CardDescription>Billing redesign, comment thread</CardDescription>
        <CardAction className="text-xs text-muted-foreground tabular-nums">
          {comments.length} replies
        </CardAction>
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col gap-4">
          {comments.map((comment) => (
            <li key={comment.id} className="flex gap-3">
              <span
                aria-hidden
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-muted-foreground"
              >
                {initialsOf(comment.author)}
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <div className="flex items-baseline gap-2 text-sm">
                  <span className="font-medium">{comment.author}</span>
                  <span className="text-xs text-muted-foreground">
                    {comment.time}
                  </span>
                </div>
                <p className="text-sm break-words text-muted-foreground">
                  {comment.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2 border-t">
        <MentionTextarea
          aria-label="Reply"
          placeholder="Reply, or type @ to mention someone"
          triggers={TEAMMATES}
          value={draft}
          onValueChange={setDraft}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
              event.preventDefault()
              post()
            }
          }}
        />
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">
            Ctrl or Cmd + Enter to post
          </span>
          <Button size="sm" disabled={!canPost} onClick={post}>
            Post reply
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
