import { PHASE_PRODUCTION_BUILD } from "next/constants"

export type Maintainer = {
  login: string
  name: string
  website: string
}

export type GitHubContributor = {
  login: string
  type: string
  contributions: number
}

export const MAINTAINERS: Maintainer[] = [
  {
    login: "localhostd3veloper",
    name: "Gautam Anand",
    website: "https://localhostdeveloper.com",
  },
  {
    login: "syedfahadjunaid",
    name: "Syed Fahad Junaid",
    website: "https://syedfahadjunaid.netlify.app",
  },
]

const CONTRIBUTORS_URL =
  "https://api.github.com/repos/localhostd3veloper/drift-ui/contributors?per_page=100"
const REVALIDATE_SECONDS = 3600
const REQUEST_TIMEOUT_MS = 5000

const MAINTAINER_LOGINS = new Set(
  MAINTAINERS.map((maintainer) => maintainer.login.toLowerCase())
)

export function rankCommunity(contributors: GitHubContributor[]) {
  return contributors
    .filter(
      (contributor) =>
        contributor.type !== "Bot" &&
        !MAINTAINER_LOGINS.has(contributor.login.toLowerCase())
    )
    .sort((a, b) => b.contributions - a.contributions)
}

export function githubProfileOf(login: string) {
  return `https://github.com/${login}`
}

function hasPreviousPageToKeepServing() {
  return (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD
  )
}

export async function fetchCommunity() {
  const token = process.env.GITHUB_TOKEN

  try {
    const response = await fetch(CONTRIBUTORS_URL, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    if (!response.ok) {
      throw new Error(`GitHub contributors returned ${response.status}`)
    }
    return rankCommunity(await response.json())
  } catch (error) {
    if (hasPreviousPageToKeepServing()) throw error
    console.warn("Rendering /contributors without community data", error)
    return []
  }
}
