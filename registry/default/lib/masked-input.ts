export const DEFAULT_MASK_DEFINITIONS: Record<string, RegExp> = {
  "#": /\d/,
  A: /[a-zA-Z]/,
  "*": /[a-zA-Z0-9]/,
}

export function isMaskToken(
  char: string,
  definitions = DEFAULT_MASK_DEFINITIONS
): boolean {
  return char in definitions
}

export function unmaskValue(
  value: string,
  mask: string,
  definitions = DEFAULT_MASK_DEFINITIONS
): string {
  if (!value) return ""

  let raw = ""
  let valueIdx = 0

  for (let m = 0; m < mask.length && valueIdx < value.length; m++) {
    const maskChar = mask[m]
    const tokenRegex = definitions[maskChar]

    if (tokenRegex) {
      while (valueIdx < value.length) {
        const char = value[valueIdx++]
        if (tokenRegex.test(char)) {
          raw += char
          break
        }
      }
    } else {
      if (value[valueIdx] === maskChar) {
        valueIdx++
      }
    }
  }

  if (!raw) {
    for (let i = 0; i < value.length; i++) {
      const char = value[i]
      if (Object.values(definitions).some((regex) => regex.test(char))) {
        raw += char
      }
    }
  }

  return raw
}

export function applyMask(
  raw: string,
  mask: string,
  definitions = DEFAULT_MASK_DEFINITIONS
): { formatted: string; raw: string } {
  if (!raw) return { formatted: "", raw: "" }

  let formatted = ""
  let cleanRaw = ""
  let rawIdx = 0

  for (let m = 0; m < mask.length; m++) {
    const maskChar = mask[m]
    const tokenRegex = definitions[maskChar]

    if (tokenRegex) {
      if (rawIdx >= raw.length) break
      let found = false
      while (rawIdx < raw.length) {
        const char = raw[rawIdx++]
        if (tokenRegex.test(char)) {
          formatted += char
          cleanRaw += char
          found = true
          break
        }
      }
      if (!found) break
    } else {
      if (rawIdx > 0 && rawIdx <= raw.length) {
        formatted += maskChar
      } else if (rawIdx === 0 && raw.length > 0) {
        formatted += maskChar
      } else {
        break
      }
    }
  }

  return { formatted, raw: cleanRaw }
}

export function calculateMaskCaretPosition({
  nextFormatted,
  rawInput,
  rawCursorPos,
  mask,
  definitions = DEFAULT_MASK_DEFINITIONS,
}: {
  nextFormatted: string
  rawInput: string
  rawCursorPos: number
  mask: string
  definitions?: Record<string, RegExp>
}): number {
  let rawCharsBefore = 0
  for (let i = 0; i < Math.min(rawCursorPos, rawInput.length); i++) {
    const char = rawInput[i]
    if (Object.values(definitions).some((regex) => regex.test(char))) {
      rawCharsBefore++
    }
  }

  if (rawCharsBefore === 0) {
    let idx = 0
    while (idx < nextFormatted.length && !isMaskToken(mask[idx], definitions)) {
      idx++
    }
    return idx
  }

  let rawCount = 0
  let caretIndex = 0

  for (let i = 0; i < nextFormatted.length; i++) {
    if (isMaskToken(mask[i], definitions)) {
      rawCount++
      if (rawCount === rawCharsBefore) {
        caretIndex = i + 1
        break
      }
    }
  }

  while (
    caretIndex < nextFormatted.length &&
    !isMaskToken(mask[caretIndex], definitions)
  ) {
    caretIndex++
  }

  return Math.min(caretIndex, nextFormatted.length)
}

export function getCurrencyInfo(
  locale: string = "en-US",
  currency: string = "USD"
) {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  })
  const fractionDigits = formatter.resolvedOptions().maximumFractionDigits ?? 2
  const parts = formatter.formatToParts(123456.78)

  const decimal = parts.find((p) => p.type === "decimal")?.value ?? "."
  const group = parts.find((p) => p.type === "group")?.value ?? ","
  const currencySymbol =
    parts.find((p) => p.type === "currency")?.value ?? currency

  const firstPart = parts[0]?.type
  const isPrefix = firstPart === "currency"

  return {
    formatter,
    fractionDigits,
    decimal,
    group,
    currencySymbol,
    isPrefix,
  }
}

export function formatCurrency(
  cents: number | null | undefined,
  locale: string = "en-US",
  currency: string = "USD"
): string {
  if (cents === null || cents === undefined || Number.isNaN(cents)) {
    return ""
  }

  const { formatter, fractionDigits } = getCurrencyInfo(locale, currency)
  const amount =
    fractionDigits > 0 ? cents / Math.pow(10, fractionDigits) : cents

  return formatter.format(amount)
}

export function parseCurrency(
  text: string,
  locale: string = "en-US",
  currency: string = "USD"
): number | null {
  const { fractionDigits, decimal, group } = getCurrencyInfo(locale, currency)

  const clean = text
    .split(group)
    .join("")
    .replace(/[^\d.-]/g, (match) => (match === decimal ? "." : ""))
    .trim()

  if (!clean || clean === "-" || clean === ".") return null

  const isNegative = clean.startsWith("-")
  const unsigned = clean.replace(/-/g, "")

  const [intPart = "0", fracPart = ""] = unsigned.split(".")
  const intVal = Number(intPart) || 0

  if (fractionDigits === 0) {
    const total = intVal
    return isNegative ? -total : total
  }

  const paddedFrac = fracPart
    .padEnd(fractionDigits, "0")
    .slice(0, fractionDigits)
  const total = intVal * Math.pow(10, fractionDigits) + Number(paddedFrac)

  return isNegative ? -total : total
}

export function formatCurrencyLive(
  input: string,
  locale: string = "en-US",
  currency: string = "USD"
): { formatted: string; cents: number | null } {
  const { fractionDigits, decimal, currencySymbol, isPrefix } = getCurrencyInfo(
    locale,
    currency
  )

  let intDigits = ""
  let fracDigits = ""
  let foundDecimal = false

  const cleanInput = input
    .replace(new RegExp(`\\${currencySymbol}`, "g"), "")
    .trim()

  for (let i = 0; i < cleanInput.length; i++) {
    const char = cleanInput[i]
    if (char === decimal && fractionDigits > 0) {
      if (!foundDecimal) {
        foundDecimal = true
      }
    } else if (/\d/.test(char)) {
      if (foundDecimal) {
        if (fracDigits.length < fractionDigits) {
          fracDigits += char
        }
      } else {
        intDigits += char
      }
    }
  }

  if (!intDigits && !fracDigits && !foundDecimal) {
    return { formatted: "", cents: null }
  }

  const intNumber = intDigits ? Number(intDigits) : 0
  const formattedInt = new Intl.NumberFormat(locale, {
    useGrouping: true,
  }).format(intNumber)

  const displayInt = intDigits ? formattedInt : "0"

  let body = displayInt
  if (foundDecimal) {
    body += decimal + fracDigits
  }

  const formatted = isPrefix
    ? `${currencySymbol}${body}`
    : `${body} ${currencySymbol}`

  const paddedFrac = fracDigits
    .padEnd(fractionDigits, "0")
    .slice(0, fractionDigits)
  const cents =
    fractionDigits > 0
      ? intNumber * Math.pow(10, fractionDigits) + Number(paddedFrac)
      : intNumber

  return { formatted, cents }
}

export function calculateCurrencyCaretPosition({
  nextFormatted,
  rawInput,
  rawCursorPos,
  locale = "en-US",
  currency = "USD",
}: {
  nextFormatted: string
  rawInput: string
  rawCursorPos: number
  locale?: string
  currency?: string
}): number {
  const { decimal } = getCurrencyInfo(locale, currency)

  const rawDecimalIdx = rawInput.indexOf(decimal)
  const isBeforeOrAtDecimal =
    rawDecimalIdx === -1 || rawCursorPos <= rawDecimalIdx

  if (isBeforeOrAtDecimal) {
    let intDigitsBefore = 0
    for (let i = 0; i < Math.min(rawCursorPos, rawInput.length); i++) {
      if (/\d/.test(rawInput[i])) {
        intDigitsBefore++
      }
    }

    if (intDigitsBefore === 0) {
      let idx = 0
      while (idx < nextFormatted.length && !/\d/.test(nextFormatted[idx])) {
        idx++
      }
      return idx
    }

    let count = 0
    let caretIndex = nextFormatted.length
    const nextDecimalIdx = nextFormatted.indexOf(decimal)
    const intLimit =
      nextDecimalIdx !== -1 ? nextDecimalIdx : nextFormatted.length

    for (let i = 0; i < intLimit; i++) {
      if (/\d/.test(nextFormatted[i])) {
        count++
        if (count === intDigitsBefore) {
          caretIndex = i + 1
          break
        }
      }
    }

    return caretIndex
  }

  // Cursor is after decimal in rawInput
  const nextDecimalIdx = nextFormatted.indexOf(decimal)
  if (nextDecimalIdx === -1) {
    return nextFormatted.length
  }

  let fracDigitsBefore = 0
  for (
    let i = rawDecimalIdx + 1;
    i < Math.min(rawCursorPos, rawInput.length);
    i++
  ) {
    if (/\d/.test(rawInput[i])) {
      fracDigitsBefore++
    }
  }

  if (fracDigitsBefore === 0) {
    return nextDecimalIdx + 1
  }

  let fracCount = 0
  let caretIndex = nextFormatted.length

  for (let i = nextDecimalIdx + 1; i < nextFormatted.length; i++) {
    if (/\d/.test(nextFormatted[i])) {
      fracCount++
      if (fracCount === fracDigitsBefore) {
        caretIndex = i + 1
        break
      }
    }
  }

  return caretIndex
}
