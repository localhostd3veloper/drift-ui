export type PrimitiveLibrary = "radix" | "base"

export const PRIMITIVE_LIBRARIES: { value: PrimitiveLibrary; label: string }[] =
  [
    { value: "radix", label: "Radix" },
    { value: "base", label: "Base UI" },
  ]

export const PRIMITIVE_LIBRARY_COOKIE = "drift-ui-primitives"
