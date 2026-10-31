import { ArrowUpRightIcon } from "lucide-react"

import { ContributorAvatar } from "@/components/contributors/contributor-avatar"
import { githubProfileOf, type Maintainer } from "@/lib/contributors"

function hostOf(url: string) {
  return new URL(url).host
}

export function MaintainerCard({ maintainer }: { maintainer: Maintainer }) {
  const links = [
    { href: githubProfileOf(maintainer.login), label: `@${maintainer.login}` },
    { href: maintainer.website, label: hostOf(maintainer.website) },
  ]

  return (
    <article className="group flex flex-col gap-5">
      <div className="overflow-hidden rounded-2xl border">
        <ContributorAvatar
          login={maintainer.login}
          sizePx={460}
          className="aspect-square h-auto w-full rounded-none border-0 grayscale transition-[filter,scale] duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-3xl leading-tight font-medium tracking-tight">
          {maintainer.name}
        </h3>
        <ul className="flex flex-col items-start gap-1 text-sm text-muted-foreground">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="group/link inline-flex items-center gap-1 transition-colors hover:text-foreground"
              >
                {link.label}
                <ArrowUpRightIcon className="size-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
