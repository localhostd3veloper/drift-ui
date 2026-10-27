import { describe, expect, it } from "vitest"

import {
  countTokens,
  formatThemeCss,
  parseThemeCss,
  scopeThemeCss,
  withToken,
} from "@/lib/theme-css"

const SHADCN_V4_GLOBALS = `
@import "tailwindcss";

/* brand palette */
:root {
  --radius: 0.5rem;
  --background: oklch(1 0 0);
  --primary: oklch(0.55 0.2 260);
}

.dark {
  --background: oklch(0.15 0 0);
  --primary: oklch(0.75 0.12 260);
}

@theme inline {
  --color-primary: var(--primary);
}

@layer base {
  body {
    @apply bg-background text-foreground;
  }
}
`

describe("theme css", () => {
  it("reads :root and .dark tokens and skips every other rule", () => {
    const theme = parseThemeCss(SHADCN_V4_GLOBALS)

    expect(theme.light).toEqual({
      "--radius": "0.5rem",
      "--background": "oklch(1 0 0)",
      "--primary": "oklch(0.55 0.2 260)",
    })
    expect(theme.dark).toEqual({
      "--background": "oklch(0.15 0 0)",
      "--primary": "oklch(0.75 0.12 260)",
    })
  })

  it("reads tokens nested in @layer base and wraps bare HSL channels", () => {
    const theme = parseThemeCss(`
      @layer base {
        :root { --primary: 222.2 47.4% 11.2%; }
        .dark { --primary: 210 40% 98% / 50%; }
      }
    `)

    expect(theme.light["--primary"]).toBe("hsl(222.2 47.4% 11.2%)")
    expect(theme.dark["--primary"]).toBe("hsl(210 40% 98% / 50%)")
  })

  it("drops declarations that are not tokens or could load or inject css", () => {
    const theme = parseThemeCss(`
      :root {
        color: red;
        --logo: url(https://example.com/a.png);
        --escaped: x\\7d;
        --ok: 1rem;
      }
      .dark { --sneaky: x } body { display: none }
    `)

    expect(theme.light).toEqual({ "--ok": "1rem" })
    expect(theme.dark).toEqual({ "--sneaky": "x" })
    expect(formatThemeCss(theme)).not.toContain("display")
  })

  it("round trips through its own format", () => {
    const theme = parseThemeCss(SHADCN_V4_GLOBALS)

    expect(parseThemeCss(formatThemeCss(theme))).toEqual(theme)
    expect(formatThemeCss({ light: {}, dark: {} })).toBe("")
  })

  it("scopes light tokens to the selectors and dark tokens under .dark", () => {
    const theme = withToken(
      { light: {}, dark: {} },
      "dark",
      "--primary",
      "oklch(0.7 0 0)"
    )
    const css = scopeThemeCss(theme, ["[data-canvas]", "[data-popper]"])

    expect(css).toBe(
      ".dark [data-canvas], .dark [data-popper] {\n  --primary: oklch(0.7 0 0);\n}"
    )
    expect(countTokens(theme)).toEqual({ light: 0, dark: 1 })
  })
})
