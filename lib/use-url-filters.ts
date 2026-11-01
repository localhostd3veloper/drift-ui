import { useEffect, useState, useSyncExternalStore } from "react"

const URL_SYNC_DELAY_MS = 250

function subscribeToNothing() {
  return () => {}
}

export function useUrlFilters<Filters>(
  parse: (search: string) => Filters,
  toParams: (filters: Filters) => URLSearchParams
) {
  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => ""
  )
  const [edited, setEdited] = useState<Filters | null>(null)

  useEffect(() => {
    if (!edited) return

    const timeout = setTimeout(() => {
      const params = toParams(edited)
      const query = params.size > 0 ? `?${params}` : ""
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${query}`
      )
    }, URL_SYNC_DELAY_MS)

    return () => clearTimeout(timeout)
  }, [edited, toParams])

  return [edited ?? parse(search), setEdited] as const
}
