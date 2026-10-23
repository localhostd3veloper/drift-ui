export function KeyboardArt() {
  return (
    <svg viewBox="0 0 240 120" fill="none" className="w-full max-w-64">
      <rect
        x="16"
        y="42"
        width="48"
        height="36"
        rx="7"
        pathLength={1}
        className="draw"
      />
      <text
        x="40"
        y="64"
        textAnchor="middle"
        className="fill-current stroke-none font-mono text-[10px]"
      >
        esc
      </text>
      <rect
        x="76"
        y="42"
        width="36"
        height="36"
        rx="7"
        pathLength={1}
        className="draw [animation-delay:150ms]"
      />
      <path
        d="M94 68 V52 M87 59 L94 52 L101 59"
        pathLength={1}
        className="draw [animation-delay:450ms]"
      />
      <rect
        x="124"
        y="42"
        width="36"
        height="36"
        rx="7"
        pathLength={1}
        className="draw [animation-delay:300ms]"
      />
      <path
        d="M142 52 V68 M135 61 L142 68 L149 61"
        pathLength={1}
        className="draw [animation-delay:600ms]"
      />
      <rect
        x="172"
        y="42"
        width="52"
        height="36"
        rx="7"
        pathLength={1}
        className="draw [animation-delay:450ms]"
      />
      <path
        d="M210 52 V64 H186 M192 58 L186 64 L192 70"
        pathLength={1}
        className="draw [animation-delay:750ms]"
      />
    </svg>
  )
}
