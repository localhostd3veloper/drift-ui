"use client"

import { StarIcon } from "lucide-react"
import { Tooltip } from "radix-ui"
import { siGithub } from "simple-icons"

import { siteConfig } from "@/lib/site-config"

export function GithubStarLink() {
  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <a
            href={siteConfig.repo}
            target="_blank"
            rel="noreferrer"
            aria-label="Star drift-ui on GitHub"
            className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
              <path d={siGithub.path} />
            </svg>
          </a>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="bottom"
            sideOffset={10}
            className="z-50 flex origin-(--radix-tooltip-content-transform-origin) animate-in items-center gap-1.5 rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background shadow-md fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          >
            <StarIcon className="size-3.5 fill-current text-brand" />
            Like drift-ui? Star it on GitHub
            <Tooltip.Arrow className="fill-foreground" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
