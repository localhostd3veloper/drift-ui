import { SAND_THEME, SLATE_THEME } from "@/lib/showcase-palettes"
import { EMPTY_THEME, formatThemeCss, type Theme } from "@/lib/theme-css"

export type ThemePreset = {
  id: string
  label: string
  theme: Theme
}

export const RADIUS_TOKEN = "--radius"

export const DEFAULT_RADIUS = "0.625rem"

export const RADIUS_OPTIONS = ["0rem", "0.3rem", "0.5rem", "0.625rem", "1rem"]

const LIGHT_TEXT = "oklch(0.985 0 0)"
const DARK_TEXT = "oklch(0.205 0 0)"

function accentTheme({
  light,
  dark,
  lightForeground = LIGHT_TEXT,
  darkForeground = DARK_TEXT,
}: {
  light: string
  dark: string
  lightForeground?: string
  darkForeground?: string
}): Theme {
  return {
    light: {
      "--primary": light,
      "--primary-foreground": lightForeground,
      "--ring": light,
    },
    dark: {
      "--primary": dark,
      "--primary-foreground": darkForeground,
      "--ring": dark,
    },
  }
}

export const THEME_PRESETS: ThemePreset[] = [
  { id: "neutral", label: "Neutral", theme: EMPTY_THEME },
  { id: "slate", label: "Slate", theme: SLATE_THEME },
  { id: "sand", label: "Sand", theme: SAND_THEME },
  {
    id: "cobalt",
    label: "Cobalt",
    theme: accentTheme({
      light: "oklch(0.53 0.18 260)",
      dark: "oklch(0.769 0.117 261.6)",
    }),
  },
  {
    id: "sky",
    label: "Sky",
    theme: accentTheme({
      light: "oklch(0.588 0.158 241.966)",
      dark: "oklch(0.746 0.16 232.661)",
    }),
  },
  {
    id: "teal",
    label: "Teal",
    theme: accentTheme({
      light: "oklch(0.6 0.118 184.704)",
      dark: "oklch(0.777 0.152 181.912)",
    }),
  },
  {
    id: "emerald",
    label: "Emerald",
    theme: accentTheme({
      light: "oklch(0.52 0.12 163)",
      dark: "oklch(0.77 0.15 163)",
    }),
  },
  {
    id: "amber",
    label: "Amber",
    theme: accentTheme({
      light: "oklch(0.769 0.188 70.08)",
      dark: "oklch(0.828 0.189 84.429)",
      lightForeground: "oklch(0.279 0.077 45.635)",
      darkForeground: "oklch(0.279 0.077 45.635)",
    }),
  },
  {
    id: "ember",
    label: "Ember",
    theme: accentTheme({
      light: "oklch(0.56 0.19 41)",
      dark: "oklch(0.75 0.16 50)",
    }),
  },
  {
    id: "rose",
    label: "Rose",
    theme: accentTheme({
      light: "oklch(0.586 0.253 17.585)",
      dark: "oklch(0.712 0.194 13.428)",
    }),
  },
  {
    id: "fuchsia",
    label: "Fuchsia",
    theme: accentTheme({
      light: "oklch(0.591 0.293 322.896)",
      dark: "oklch(0.74 0.238 322.16)",
    }),
  },
  {
    id: "violet",
    label: "Violet",
    theme: accentTheme({
      light: "oklch(0.541 0.281 293.009)",
      dark: "oklch(0.702 0.183 293.541)",
    }),
  },
]

function withoutRadius(theme: Theme): Theme {
  const light = Object.fromEntries(
    Object.entries(theme.light).filter(([name]) => name !== RADIUS_TOKEN)
  )
  return { light, dark: theme.dark }
}

export function findActivePreset(theme: Theme) {
  const colors = formatThemeCss(withoutRadius(theme))
  return THEME_PRESETS.find((preset) => formatThemeCss(preset.theme) === colors)
}

export function readRadius(theme: Theme) {
  return theme.light[RADIUS_TOKEN] ?? DEFAULT_RADIUS
}

export function applyPreset(current: Theme, preset: ThemePreset): Theme {
  const radius = current.light[RADIUS_TOKEN]
  if (!radius) return preset.theme
  return {
    light: { ...preset.theme.light, [RADIUS_TOKEN]: radius },
    dark: preset.theme.dark,
  }
}
