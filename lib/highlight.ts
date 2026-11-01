import { createHighlighter, type Highlighter } from "shiki"

let highlighter: Promise<Highlighter> | undefined

function getHighlighter() {
  highlighter ??= createHighlighter({
    themes: ["github-light-default", "github-dark-default"],
    langs: ["tsx", "bash"],
  })
  return highlighter
}

const THEMES = {
  lang: "tsx",
  themes: { light: "github-light-default", dark: "github-dark-default" },
  defaultColor: false,
} as const

export async function highlight(code: string, lang: "tsx" | "bash" = "tsx") {
  const instance = await getHighlighter()

  return instance.codeToHtml(code, { ...THEMES, lang })
}

export async function highlightInline(code: string) {
  const instance = await getHighlighter()

  return instance.codeToHtml(code, { ...THEMES, structure: "inline" })
}

export async function highlightType(code: string) {
  const instance = await getHighlighter()

  return instance.codeToHtml(code, {
    ...THEMES,
    structure: "inline",
    grammarContextCode: "type T = ",
  })
}
