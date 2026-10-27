import { ArrowUpRightIcon } from "lucide-react"

import { ContributorAvatar } from "@/components/contributors/contributor-avatar"
import {
  displayNameOf,
  githubProfileOf,
  type Contributor,
} from "@/lib/contributors"

function hostOf(url: string) {
  return new URL(url).host
}

export function MaintainerCard({ maintainer }: { maintainer: Contributor }) {
  const links = [
    { href: githubProfileOf(maintainer), label: `@${maintainer.login}` },
    ...(maintainer.website
      ? [{ href: maintainer.website, label: hostOf(maintainer.website) }]
      : []),
  ]

  return (
    <article className="flex flex-col gap-6 rounded-[1.75rem] border bg-[radial-gradient(80%_70%_at_50%_0%,color-mix(in_oklab,var(--foreground)_5%,transparent),transparent)] p-6 md:p-8">
      <div className="flex items-center gap-4">
        <ContributorAvatar login={maintainer.login} sizePx={64} />
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-medium tracking-tight">
            {displayNameOf(maintainer)}
          </h3>
          <span className="font-mono text-xs tracking-widest text-brand uppercase">
            Maintainer
          </span>
        </div>
      </div>
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1 transition-colors hover:text-foreground"
            >
              {link.label}
              <ArrowUpRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </li>
        ))}
      </ul>
    </article>
  )
}
