import contributorsFile from "@/contributors.json"

export type ContributorRole = "maintainer" | "contributor"

export type MergedPullRequest = {
  number: number
  title: string
  mergedAt: string
}

export type Contributor = {
  login: string
  name?: string
  website?: string
  role: ContributorRole
  components: string[]
  pullRequests: MergedPullRequest[]
}

const REGISTRY_UI_PATH = /^registry\/default\/ui\/([a-z0-9-]+)\.tsx$/

export function componentsTouchedBy(changedFiles: string[]) {
  const slugs = changedFiles.flatMap((path) => {
    const match = REGISTRY_UI_PATH.exec(path.trim())
    return match ? [match[1]] : []
  })
  return [...new Set(slugs)].sort()
}

function isSameLogin(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase()
}

export function recordMergedPullRequest(
  contributors: Contributor[],
  login: string,
  pullRequest: MergedPullRequest,
  changedFiles: string[]
): Contributor[] {
  const components = componentsTouchedBy(changedFiles)
  const existing = contributors.find((contributor) =>
    isSameLogin(contributor.login, login)
  )

  if (!existing) {
    return [
      ...contributors,
      { login, role: "contributor", components, pullRequests: [pullRequest] },
    ]
  }

  const isAlreadyRecorded = existing.pullRequests.some(
    (recorded) => recorded.number === pullRequest.number
  )
  if (isAlreadyRecorded) return contributors

  const updated: Contributor = {
    ...existing,
    components: [...new Set([...existing.components, ...components])].sort(),
    pullRequests: [...existing.pullRequests, pullRequest],
  }
  return contributors.map((contributor) =>
    contributor === existing ? updated : contributor
  )
}

function firstMergedAt(contributor: Contributor) {
  return contributor.pullRequests.reduce(
    (earliest, pullRequest) =>
      pullRequest.mergedAt < earliest ? pullRequest.mergedAt : earliest,
    "9999"
  )
}

export function rankCommunity(contributors: Contributor[]) {
  return contributors
    .filter((contributor) => contributor.role === "contributor")
    .sort(
      (a, b) =>
        b.pullRequests.length - a.pullRequests.length ||
        firstMergedAt(a).localeCompare(firstMergedAt(b))
    )
}

export function displayNameOf(contributor: Contributor) {
  return contributor.name ?? contributor.login
}

export function githubProfileOf(contributor: Contributor) {
  return `https://github.com/${contributor.login}`
}

export const CONTRIBUTORS = contributorsFile as Contributor[]

export const MAINTAINERS = CONTRIBUTORS.filter(
  (contributor) => contributor.role === "maintainer"
)

export const COMMUNITY = rankCommunity(CONTRIBUTORS)

export const MERGED_PULL_REQUEST_COUNT = CONTRIBUTORS.reduce(
  (total, contributor) => total + contributor.pullRequests.length,
  0
)
