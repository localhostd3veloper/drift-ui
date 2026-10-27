export type ThemeTokens = Record<string, string>

export type ThemeMode = "light" | "dark"

export type Theme = Record<ThemeMode, ThemeTokens>

export const EMPTY_THEME: Theme = { light: {}, dark: {} }

const COMMENT_PATTERN = /\/\*[\s\S]*?\*\//g
const RULE_PATTERN = /([^{}]+)\{([^{}]*)\}/g
const DARK_SELECTOR_PATTERN = /\.dark\b|\[data-theme=["']?dark["']?\]/
const LIGHT_SELECTOR_PATTERN =
  /^(:root|html|:host)(\s*,\s*(:root|html|:host))*$/
const TOKEN_NAME_PATTERN = /^--[a-zA-Z0-9_-]+$/
const UNSAFE_VALUE_PATTERN = /[{}<>\\]|url\(|@import|expression\(/i
const HSL_CHANNELS_PATTERN =
  /^-?[\d.]+(deg)?\s+[\d.]+%\s+[\d.]+%(\s*\/\s*[\d.]+%?)?$/

function modeOfSelector(prelude: string): ThemeMode | null {
  const normalized = (prelude.split(";").pop() ?? "").trim()
  if (DARK_SELECTOR_PATTERN.test(normalized)) return "dark"
  if (LIGHT_SELECTOR_PATTERN.test(normalized)) return "light"
  return null
}

function normalizeValue(value: string) {
  if (HSL_CHANNELS_PATTERN.test(value)) return `hsl(${value})`
  return value
}

function parseDeclarations(body: string): ThemeTokens {
  const tokens: ThemeTokens = {}
  for (const declaration of body.split(";")) {
    const separatorIndex = declaration.indexOf(":")
    if (separatorIndex === -1) continue
    const name = declaration.slice(0, separatorIndex).trim()
    const value = declaration.slice(separatorIndex + 1).trim()
    if (!TOKEN_NAME_PATTERN.test(name)) continue
    if (!value || UNSAFE_VALUE_PATTERN.test(value)) continue
    tokens[name] = normalizeValue(value)
  }
  return tokens
}

export function parseThemeCss(source: string): Theme {
  const theme: Theme = { light: {}, dark: {} }
  const css = source.replace(COMMENT_PATTERN, "")
  for (const [, selector, body] of css.matchAll(RULE_PATTERN)) {
    const mode = modeOfSelector(selector)
    if (!mode) continue
    Object.assign(theme[mode], parseDeclarations(body))
  }
  return theme
}

function formatBlock(selector: string, tokens: ThemeTokens) {
  const lines = Object.entries(tokens).map(
    ([name, value]) => `  ${name}: ${value};`
  )
  if (lines.length === 0) return null
  return `${selector} {\n${lines.join("\n")}\n}`
}

export function formatThemeCss(theme: Theme) {
  return [formatBlock(":root", theme.light), formatBlock(".dark", theme.dark)]
    .filter(Boolean)
    .join("\n\n")
}

export function countTokens(theme: Theme) {
  return {
    light: Object.keys(theme.light).length,
    dark: Object.keys(theme.dark).length,
  }
}

export function isEmptyTheme(theme: Theme) {
  const counts = countTokens(theme)
  return counts.light + counts.dark === 0
}

export function withToken(
  theme: Theme,
  mode: ThemeMode,
  name: string,
  value: string
): Theme {
  return { ...theme, [mode]: { ...theme[mode], [name]: value } }
}

export function scopeThemeCss(theme: Theme, scopeSelectors: string[]) {
  const lightSelector = scopeSelectors.join(", ")
  const darkSelector = scopeSelectors
    .map((selector) => `.dark ${selector}`)
    .join(", ")
  return [
    formatBlock(lightSelector, theme.light),
    formatBlock(darkSelector, theme.dark),
  ]
    .filter(Boolean)
    .join("\n")
}
