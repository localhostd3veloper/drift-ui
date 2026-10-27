import { describe, expect, it } from "vitest"

import {
  componentsTouchedBy,
  rankCommunity,
  recordMergedPullRequest,
  type Contributor,
} from "@/lib/contributors"

const PULL_REQUEST = {
  number: 30,
  title: "feat(registry): add avatar group",
  mergedAt: "2026-11-02T10:00:00Z",
}

function contributorOf(
  login: string,
  overrides: Partial<Contributor> = {}
): Contributor {
  return {
    login,
    role: "contributor",
    components: [],
    pullRequests: [],
    ...overrides,
  }
}

describe("contributors", () => {
  it("reads component slugs from registry ui paths only", () => {
    expect(
      componentsTouchedBy([
        "registry/default/ui/avatar-group.tsx",
        "registry/default/ui/avatar-group.tsx",
        "registry/default/lib/avatar-group.ts",
        "components/preview/avatar-group-preview.tsx",
        "registry/default/ui/badge.tsx",
      ])
    ).toEqual(["avatar-group", "badge"])
  })

  it("adds a first-time author as a contributor", () => {
    const result = recordMergedPullRequest([], "octocat", PULL_REQUEST, [
      "registry/default/ui/avatar-group.tsx",
    ])

    expect(result).toEqual([
      contributorOf("octocat", {
        components: ["avatar-group"],
        pullRequests: [PULL_REQUEST],
      }),
    ])
  })

  it("appends to an existing entry and keeps its profile and role", () => {
    const existing = contributorOf("OctoCat", {
      name: "Octo Cat",
      website: "https://octo.cat",
      role: "maintainer",
      components: ["badge"],
    })

    const [updated] = recordMergedPullRequest(
      [existing],
      "octocat",
      PULL_REQUEST,
      ["registry/default/ui/avatar-group.tsx"]
    )

    expect(updated).toEqual({
      ...existing,
      components: ["avatar-group", "badge"],
      pullRequests: [PULL_REQUEST],
    })
  })

  it("ignores a pull request that is already recorded", () => {
    const existing = [
      contributorOf("octocat", { pullRequests: [PULL_REQUEST] }),
    ]

    expect(recordMergedPullRequest(existing, "octocat", PULL_REQUEST, [])).toBe(
      existing
    )
  })

  it("ranks community by merged count, then by who merged first", () => {
    const early = { ...PULL_REQUEST, mergedAt: "2026-11-01T00:00:00Z" }
    const late = { ...PULL_REQUEST, mergedAt: "2026-11-05T00:00:00Z" }

    const ranked = rankCommunity([
      contributorOf("maintainer", {
        role: "maintainer",
        pullRequests: [early, late],
      }),
      contributorOf("late", { pullRequests: [late] }),
      contributorOf("prolific", { pullRequests: [late, late] }),
      contributorOf("early", { pullRequests: [early] }),
    ])

    expect(ranked.map((contributor) => contributor.login)).toEqual([
      "prolific",
      "early",
      "late",
    ])
  })
})
