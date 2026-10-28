import { readdirSync, readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const BASE_UI_REGISTRY_DIR = "public/r/base"

describe("Base UI registry build", () => {
  it.each(readdirSync(BASE_UI_REGISTRY_DIR))(
    "%s never references radix-ui",
    (file) => {
      expect(
        readFileSync(`${BASE_UI_REGISTRY_DIR}/${file}`, "utf8")
      ).not.toContain("radix-ui")
    }
  )
})
