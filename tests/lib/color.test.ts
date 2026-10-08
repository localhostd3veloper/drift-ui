import { describe, expect, it } from "vitest"

import {
  formatHex,
  formatOklch,
  formatRgba,
  parseHex,
} from "@/registry/default/lib/color"

describe("color", () => {
  it("accepts 3, 4, 6 and 8 digit hex with or without the hash", () => {
    expect(parseHex("#fff")).toMatchObject({ s: 0, v: 1, a: 1 })
    expect(parseHex("000000")).toMatchObject({ v: 0, a: 1 })
    expect(parseHex("#ff000080")?.a).toBeCloseTo(128 / 255)
    expect(parseHex("#ff00")).not.toBeNull()
    expect(parseHex("#12345")).toBeNull()
    expect(parseHex("teal")).toBeNull()
  })

  it("round trips hex through HSVA", () => {
    for (const hex of ["#6366f1", "#10b981", "#0f172a", "#64748b80"]) {
      const parsed = parseHex(hex)
      expect(parsed).not.toBeNull()
      expect(formatHex(parsed!)).toBe(hex)
    }
  })

  it("formats rgba with rounded channels", () => {
    expect(formatRgba(parseHex("#ff0000")!)).toBe("rgb(255 0 0 / 1)")
  })

  it("converts to oklch matching the reference values", () => {
    expect(formatOklch(parseHex("#ffffff")!)).toBe("oklch(1 0 0)")
    expect(formatOklch(parseHex("#000000")!)).toBe("oklch(0 0 0)")
    expect(formatOklch(parseHex("#ff0000")!)).toBe("oklch(0.628 0.258 29.2)")
  })

  it("adds an alpha channel to oklch only when translucent", () => {
    expect(formatOklch(parseHex("#ffffff80")!)).toMatch(/ \/ 50%\)$/)
  })
})
