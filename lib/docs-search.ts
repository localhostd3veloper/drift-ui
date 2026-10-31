import { defaultFilter } from "cmdk"

const NAME_MATCH = 1
const KEYWORD_MATCH = 0.5
const FUZZY_WEIGHT = 0.4
const MIN_FUZZY_SCORE = 0.15

export function scoreSearchEntry(
  name: string,
  search: string,
  keywords: string[] = []
) {
  const query = search.trim().toLowerCase()
  if (name.toLowerCase().includes(query)) return NAME_MATCH
  if (keywords.join(" ").toLowerCase().includes(query)) return KEYWORD_MATCH

  const fuzzyScore = defaultFilter?.(name, query) ?? 0

  return fuzzyScore >= MIN_FUZZY_SCORE ? fuzzyScore * FUZZY_WEIGHT : 0
}
