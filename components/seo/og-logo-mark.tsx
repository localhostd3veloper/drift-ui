export const OG_COLORS = {
  foreground: "#fafafa",
  muted: "#a1a1a1",
  drift: "#8ab4ff",
  page: "#0a0a0a",
  card: "#171717",
  border: "#2e2e2e",
  brandSolid: "#1e59cd",
  clearing:
    "radial-gradient(46% 60% at 50% 48%, #0a0a0a 55%, rgba(10, 10, 10, 0) 100%)",
  glow: "radial-gradient(46% 62% at 50% 46%, rgba(30, 89, 205, 0.3), rgba(30, 89, 205, 0) 100%)",
}

export function OgLogoMark({ size = 64 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill={OG_COLORS.foreground}
    >
      <rect x="3" y="10" width="12" height="12" rx="3" />
      <rect x="3" y="25" width="12" height="12" rx="3" />
      <rect x="18" y="25" width="12" height="12" rx="3" />
      <rect
        x="18.75"
        y="10.75"
        width="10.5"
        height="10.5"
        rx="2.25"
        fill="none"
        stroke={OG_COLORS.muted}
        strokeOpacity="0.6"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />
      <rect
        x="25"
        y="3"
        width="12"
        height="12"
        rx="3"
        fill={OG_COLORS.drift}
        transform="rotate(10 31 9)"
      />
    </svg>
  )
}
