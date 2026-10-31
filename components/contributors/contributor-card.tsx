import { ContributorAvatar } from "@/components/contributors/contributor-avatar"
import { githubProfileOf, type GitHubContributor } from "@/lib/contributors"

function mergedLabelOf(count: number) {
  return count === 1 ? "1 merged pull request" : `${count} merged pull requests`
}

export function ContributorCard({
  contributor,
}: {
  contributor: GitHubContributor
}) {
  return (
    <article className="flex items-center gap-3 rounded-2xl border p-5">
      <ContributorAvatar login={contributor.login} sizePx={40} />
      <div className="flex min-w-0 flex-col">
        <a
          href={githubProfileOf(contributor.login)}
          target="_blank"
          rel="noreferrer"
          className="truncate font-medium transition-colors hover:text-brand"
        >
          @{contributor.login}
        </a>
        <span className="text-sm text-muted-foreground">
          {mergedLabelOf(contributor.contributions)}
        </span>
      </div>
    </article>
  )
}
