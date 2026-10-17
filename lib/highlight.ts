import { createHighlighter, type Highlighter } from "shiki"

let highlighter: Promise<Highlighter> | undefined

function getHighlighter() {
  highlighter ??= createHighlighter({
    themes: ["github-light-default", "github-dark-default"],
    langs: ["tsx"],
  })
  return highlighter
}

export async function highlight(code: string) {
  const instance = await getHighlighter()

  return instance.codeToHtml(code, {
    lang: "tsx",
    themes: { light: "github-light-default", dark: "github-dark-default" },
    defaultColor: false,
  })
}
