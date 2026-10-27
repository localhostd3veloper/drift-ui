import { readFileSync, writeFileSync } from "node:fs"

import { recordMergedPullRequest, type Contributor } from "@/lib/contributors"

const CONTRIBUTORS_PATH = new URL("../contributors.json", import.meta.url)

function requireEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing environment variable ${name}`)
  return value
}

const changedFilesPath = process.argv[2]
if (!changedFilesPath) {
  throw new Error(
    "Usage: bun scripts/record-contributor.ts <changed-files.txt>"
  )
}

const changedFiles = readFileSync(changedFilesPath, "utf8")
  .split("\n")
  .filter(Boolean)
const contributors: Contributor[] = JSON.parse(
  readFileSync(CONTRIBUTORS_PATH, "utf8")
)

const updated = recordMergedPullRequest(
  contributors,
  requireEnv("PR_AUTHOR"),
  {
    number: Number(requireEnv("PR_NUMBER")),
    title: requireEnv("PR_TITLE"),
    mergedAt: requireEnv("PR_MERGED_AT"),
  },
  changedFiles
)

writeFileSync(CONTRIBUTORS_PATH, `${JSON.stringify(updated, null, 2)}\n`)
