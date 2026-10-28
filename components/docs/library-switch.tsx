"use client"

import { useOptimistic, useTransition } from "react"
import { useRouter } from "next/navigation"

import { SegmentedControl } from "@/components/docs/segmented-control"
import {
  PRIMITIVE_LIBRARIES,
  PRIMITIVE_LIBRARY_COOKIE,
  type PrimitiveLibrary,
} from "@/lib/primitive-library"

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

export function LibrarySwitch({ library }: { library: PrimitiveLibrary }) {
  const router = useRouter()
  const [shownLibrary, setShownLibrary] = useOptimistic(library)
  const [, startTransition] = useTransition()

  function selectLibrary(next: PrimitiveLibrary) {
    document.cookie = `${PRIMITIVE_LIBRARY_COOKIE}=${next}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`
    startTransition(() => {
      setShownLibrary(next)
      router.refresh()
    })
  }

  return (
    <SegmentedControl
      items={PRIMITIVE_LIBRARIES}
      value={shownLibrary}
      onValueChange={selectLibrary}
      label="Primitive library"
    />
  )
}
