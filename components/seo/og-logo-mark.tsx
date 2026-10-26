export const OG_COLORS = {
  foreground: "#fafafa",
  muted: "#a1a1a1",
  drift: "#8ab4ff",
  background: "radial-gradient(60% 90% at 50% 120%, #262626, #0a0a0a 70%)",
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
