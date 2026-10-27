import { describe, expect, it } from "vitest"

import {
  RADIUS_TOKEN,
  THEME_PRESETS,
  applyPreset,
  findActivePreset,
  readRadius,
} from "@/lib/showcase-presets"
import { formatThemeCss, parseThemeCss, withToken } from "@/lib/theme-css"

describe("showcase presets", () => {
  it("gives every preset a unique id", () => {
    const ids = THEME_PRESETS.map((preset) => preset.id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  it("recognises each preset after it round trips through the css editor", () => {
    for (const preset of THEME_PRESETS) {
      const editedTheme = parseThemeCss(formatThemeCss(preset.theme))

      expect(findActivePreset(editedTheme)?.id).toBe(preset.id)
    }
  })

  it("keeps the chosen radius when switching presets", () => {
    const [neutral, slate] = THEME_PRESETS
    const rounded = withToken(neutral.theme, "light", RADIUS_TOKEN, "1rem")
    const switched = applyPreset(rounded, slate)

    expect(readRadius(switched)).toBe("1rem")
    expect(findActivePreset(switched)?.id).toBe(slate.id)
  })
})
