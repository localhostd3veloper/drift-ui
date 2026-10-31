import { readFile } from "node:fs/promises"
import path from "node:path"

import { OG_COLORS, OgLogoMark } from "@/components/seo/og-logo-mark"
import { siteConfig } from "@/lib/site-config"

const FONT_DIR = path.join(process.cwd(), "components/seo/fonts")
const SLOT_SIZE = 72
const FULL_BLEED = {
  position: "absolute",
  top: 0,
  left: 0,
  width: 1200,
  height: 630,
} as const

async function readFont(file: string) {
  return readFile(path.join(FONT_DIR, file))
}

export async function loadOgFonts() {
  const [display, sans, mono] = await Promise.all([
    readFont("bricolage-grotesque-600.ttf"),
    readFont("plus-jakarta-sans-400.ttf"),
    readFont("geist-mono-400.ttf"),
  ])

  return [
    {
      name: "Display",
      data: display,
      weight: 600 as const,
      style: "normal" as const,
    },
    {
      name: "Sans",
      data: sans,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Mono",
      data: mono,
      weight: 400 as const,
      style: "normal" as const,
    },
  ]
}

function SlotPattern() {
  return (
    <svg
      width="1200"
      height="630"
      viewBox="0 0 1200 630"
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <defs>
        <pattern
          id="slots"
          width={SLOT_SIZE}
          height={SLOT_SIZE}
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="8"
            y="8"
            width={SLOT_SIZE - 16}
            height={SLOT_SIZE - 16}
            rx="14"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.055"
            strokeWidth="2"
          />
        </pattern>
      </defs>
      <rect width="1200" height="630" fill="url(#slots)" />
    </svg>
  )
}

export function OgCommand({ command }: { command: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "16px 26px",
        borderRadius: 14,
        border: `1px solid ${OG_COLORS.border}`,
        background: OG_COLORS.card,
        fontFamily: "Mono",
        fontSize: 26,
        color: OG_COLORS.foreground,
      }}
    >
      <span style={{ color: OG_COLORS.muted }}>$</span>
      {command}
    </div>
  )
}

export function OgFrame({
  breadcrumb,
  children,
}: {
  breadcrumb?: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "100%",
        padding: "48px 72px 64px",
        fontFamily: "Sans",
        color: OG_COLORS.foreground,
        background: OG_COLORS.page,
      }}
    >
      <SlotPattern />
      <div style={{ ...FULL_BLEED, background: OG_COLORS.clearing }} />
      <div style={{ ...FULL_BLEED, background: OG_COLORS.glow }} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: "Display",
          fontSize: 32,
          letterSpacing: -0.5,
        }}
      >
        <OgLogoMark size={46} />
        {siteConfig.name}
        {breadcrumb && (
          <span
            style={{ fontFamily: "Sans", fontSize: 26, color: OG_COLORS.muted }}
          >
            / {breadcrumb}
          </span>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
          textAlign: "center",
        }}
      >
        {children}
      </div>
    </div>
  )
}
