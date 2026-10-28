export type PrimitiveLibrary = "base" | "radix"

export const PRIMITIVE_LIBRARIES: { value: PrimitiveLibrary; label: string }[] =
  [
    { value: "base", label: "Base UI" },
    { value: "radix", label: "Radix UI" },
  ]

export const DEFAULT_PRIMITIVE_LIBRARY: PrimitiveLibrary = "base"

export const PRIMITIVE_LIBRARY_COOKIE = "drift-ui-primitives"

export function isPrimitiveLibrary(value: unknown): value is PrimitiveLibrary {
  return PRIMITIVE_LIBRARIES.some((library) => library.value === value)
}

export function componentPath(slug: string, library?: PrimitiveLibrary) {
  return library ? `/components/${library}/${slug}` : `/components/${slug}`
}

export function registryItemPath(slug: string, library: PrimitiveLibrary) {
  return library === "base" ? `/r/base/${slug}.json` : `/r/${slug}.json`
}
