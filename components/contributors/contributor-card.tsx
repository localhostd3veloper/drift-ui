import Link from "next/link"

import { ContributorAvatar } from "@/components/contributors/contributor-avatar"
import { CATALOG } from "@/lib/catalog"
import {
  displayNameOf,
  githubProfileOf,
  type Contributor,
} from "@/lib/contributors"

const CATALOG_SLUGS = new Set(CATALOG.map((entry) => entry.slug))

function mergedLabelOf(count: number) {
  return count === 1 ? "1 merged pull request" : `${count} merged pull requests`
}

export function ContributorCard({ contributor }: { contributor: Contributor }) {
  const components = contributor.components.filter((slug) =>
    CATALOG_SLUGS.has(slug)
  )

  return (
    <article className="flex flex-col gap-4 rounded-2xl border p-5">
      <div className="flex items-center gap-3">
        <ContributorAvatar login={contributor.login} sizePx={40} />
        <div className="flex min-w-0 flex-col">
          <a
            href={contributor.website ?? githubProfileOf(contributor)}
            target="_blank"
            rel="noreferrer"
            className="truncate font-medium transition-colors hover:text-brand"
          >
            {displayNameOf(contributor)}
          </a>
          <span className="text-sm text-muted-foreground">
            {mergedLabelOf(contributor.pullRequests.length)}
          </span>
        </div>
      </div>
      {components.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {components.map((slug) => (
            <li key={slug}>
              <Link
                href={`/components/${slug}`}
                className="inline-flex h-6 items-center rounded-full border px-2.5 font-mono text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
              >
                {slug}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
