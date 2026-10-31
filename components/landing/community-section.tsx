import { HashIcon, MessagesSquareIcon } from "lucide-react"
import { siDiscord } from "simple-icons"

import { Button } from "@/registry/default/ui/button"
import { SectionHeading } from "@/components/landing/section-heading"
import { siteConfig } from "@/lib/site-config"

const CHANNELS = [
  {
    name: "help",
    Icon: MessagesSquareIcon,
    description: "Stuck on a component? Ask here.",
  },
  {
    name: "showcase",
    Icon: MessagesSquareIcon,
    description: "Show what you built with drift-ui.",
  },
  {
    name: "ideas",
    Icon: MessagesSquareIcon,
    description: "Talk through a component before it becomes an issue.",
  },
  {
    name: "contributing",
    Icon: HashIcon,
    description: "Get unstuck on an issue or a pull request.",
  },
  {
    name: "github-feed",
    Icon: HashIcon,
    description: "Follow pull requests, issues and releases as they land.",
  },
]

export function CommunitySection() {
  return (
    <section
      id="community"
      className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-24 md:px-10 md:pb-36"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-16">
        <div className="flex min-w-0 flex-col gap-10">
          <SectionHeading
            eyebrow="Community"
            title="Built in the open"
            lead="The code, the issues and the pull requests are all public. Join the Discord to get help, show what you built and work on the next component with the maintainers."
          />
          <div className="flex reveal flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button asChild size="lg" className="h-11 px-5 active:scale-[0.98]">
              <a href={siteConfig.discord} target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d={siDiscord.path} />
                </svg>
                Join the Discord
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 px-5 active:scale-[0.98]"
            >
              <a
                href={`${siteConfig.repo}/blob/main/CONTRIBUTING.md`}
                target="_blank"
                rel="noreferrer"
              >
                Read the contributing guide
              </a>
            </Button>
          </div>
        </div>
        <div className="min-w-0 reveal overflow-hidden rounded-2xl border">
          <div className="flex h-10 items-center border-b px-4 font-mono text-xs text-muted-foreground">
            drift-ui on Discord
          </div>
          <ul className="divide-y bg-muted/30">
            {CHANNELS.map(({ name, Icon, description }) => (
              <li key={name} className="flex gap-3 px-4 py-4">
                <Icon
                  aria-hidden
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                />
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="font-mono text-sm font-medium">{name}</span>
                  <span className="text-sm text-muted-foreground">
                    {description}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
