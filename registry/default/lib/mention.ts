export type MentionOption = {
  value: string
  label: string
  description?: string
}

export type ActiveMention = {
  trigger: string
  query: string
  start: number
}

const TRAILING_TOKEN = /(^|\s)(\S)(\S*)$/
const MAX_VISIBLE_OPTIONS = 8

export function findActiveMention(
  text: string,
  caret: number,
  triggers: string[]
): ActiveMention | null {
  const match = TRAILING_TOKEN.exec(text.slice(0, caret))
  if (!match) return null
  const [, , trigger, query] = match
  if (!triggers.includes(trigger)) return null
  return { trigger, query, start: caret - query.length - 1 }
}

export function filterMentionOptions(options: MentionOption[], query: string) {
  const needle = query.toLowerCase()
  return options
    .filter(
      (option) =>
        option.value.toLowerCase().includes(needle) ||
        option.label.toLowerCase().includes(needle)
    )
    .slice(0, MAX_VISIBLE_OPTIONS)
}

export function insertMention(
  text: string,
  mention: ActiveMention,
  caret: number,
  option: MentionOption
) {
  const inserted = `${mention.trigger}${option.value} `
  return {
    text: text.slice(0, mention.start) + inserted + text.slice(caret),
    caret: mention.start + inserted.length,
  }
}
