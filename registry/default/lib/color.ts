export type Hsva = { h: number; s: number; v: number; a: number }
type Rgb = { r: number; g: number; b: number }

const HEX_PATTERN = /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i

function roundTo(value: number, digits: number) {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

function toHexByte(channel: number) {
  return Math.round(channel).toString(16).padStart(2, "0")
}

function srgbToLinear(channel: number) {
  const normalized = channel / 255
  if (normalized <= 0.04045) return normalized / 12.92
  return ((normalized + 0.055) / 1.055) ** 2.4
}

export function clampUnit(value: number) {
  return Math.min(1, Math.max(0, value))
}

export function hsvaToRgb({ h, s, v }: Hsva): Rgb {
  const channel = (offset: number) => {
    const k = (offset + h / 60) % 6
    return (v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255
  }
  return { r: channel(5), g: channel(3), b: channel(1) }
}

function rgbToHsv({ r, g, b }: Rgb) {
  const [red, green, blue] = [r / 255, g / 255, b / 255]
  const max = Math.max(red, green, blue)
  const chroma = max - Math.min(red, green, blue)
  const saturation = max === 0 ? 0 : chroma / max
  if (chroma === 0) return { h: 0, s: saturation, v: max }

  let sector = 0
  switch (max) {
    case red:
      sector = ((green - blue) / chroma) % 6
      break
    case green:
      sector = (blue - red) / chroma + 2
      break
    case blue:
      sector = (red - green) / chroma + 4
      break
  }
  return { h: (sector * 60 + 360) % 360, s: saturation, v: max }
}

export function parseHex(value: string): Hsva | null {
  const match = HEX_PATTERN.exec(value.trim())
  if (!match) return null
  const digits = match[1]
  const expanded =
    digits.length <= 4
      ? [...digits].map((digit) => digit + digit).join("")
      : digits
  const byteAt = (index: number) =>
    parseInt(expanded.slice(index * 2, index * 2 + 2), 16)
  const alpha = expanded.length === 8 ? byteAt(3) / 255 : 1
  return { ...rgbToHsv({ r: byteAt(0), g: byteAt(1), b: byteAt(2) }), a: alpha }
}

export function formatHex(hsva: Hsva) {
  const { r, g, b } = hsvaToRgb(hsva)
  const alpha = hsva.a < 1 ? toHexByte(hsva.a * 255) : ""
  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}${alpha}`
}

export function formatRgba(hsva: Hsva) {
  const { r, g, b } = hsvaToRgb(hsva)
  return `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)} / ${roundTo(hsva.a, 2)})`
}

export function formatOklch(hsva: Hsva) {
  const { r, g, b } = hsvaToRgb(hsva)
  const [red, green, blue] = [srgbToLinear(r), srgbToLinear(g), srgbToLinear(b)]
  const long = Math.cbrt(
    0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue
  )
  const medium = Math.cbrt(
    0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue
  )
  const short = Math.cbrt(
    0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue
  )

  const lightness =
    0.2104542553 * long + 0.793617785 * medium - 0.0040720468 * short
  const greenRed =
    1.9779984951 * long - 2.428592205 * medium + 0.4505937099 * short
  const blueYellow =
    0.0259040371 * long + 0.7827717662 * medium - 0.808675766 * short
  const chroma = Math.hypot(greenRed, blueYellow)
  const hue =
    chroma < 0.0005 ? 0 : (Math.atan2(blueYellow, greenRed) * 180) / Math.PI
  const alpha = hsva.a < 1 ? ` / ${Math.round(hsva.a * 100)}%` : ""

  return `oklch(${roundTo(lightness, 3)} ${roundTo(chroma, 3)} ${roundTo((hue + 360) % 360, 1)}${alpha})`
}
