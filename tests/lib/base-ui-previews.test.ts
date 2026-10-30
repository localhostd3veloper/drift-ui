import { readdirSync, readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const BASE_UI_PREVIEW_DIR = "components/preview/base"
const DIFFERENT_BY_API = new Set(["dialog-preview.tsx", "popover-preview.tsx"])

function readPreview(path: string) {
  return readFileSync(path, "utf8")
    .replaceAll("@/registry/base/ui/", "@/registry/default/ui/")
    .replace(
      /import \{([^}]*)\}/g,
      (_, names: string) =>
        `import { ${names
          .split(",")
          .map((name) => name.trim())
          .filter(Boolean)
          .join(", ")} }`
    )
}

describe("Base UI previews", () => {
  it.each(
    readdirSync(BASE_UI_PREVIEW_DIR).filter(
      (file) => !DIFFERENT_BY_API.has(file)
    )
  )("%s matches its Radix preview apart from imports", (file) => {
    expect(readPreview(`${BASE_UI_PREVIEW_DIR}/${file}`)).toBe(
      readPreview(`components/preview/${file}`)
    )
  })
})
