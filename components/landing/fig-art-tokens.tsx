const SWATCH_POSITIONS = [
  [24, 26],
  [48, 26],
  [24, 50],
  [48, 50],
  [24, 74],
  [48, 74],
]

export function TokensArt() {
  return (
    <svg viewBox="0 0 240 120" fill="none" className="w-full max-w-md">
      {SWATCH_POSITIONS.map(([x, y], index) => (
        <rect
          key={index}
          x={x}
          y={y}
          width="18"
          height="18"
          rx="4"
          pathLength={1}
          className="draw"
          style={{ animationDelay: `${index * 90}ms` }}
        />
      ))}
      <path
        d="M70 35 C110 35 112 60 150 60"
        pathLength={1}
        className="draw [animation-delay:500ms]"
      />
      <path
        d="M70 59 C110 59 112 60 150 60"
        pathLength={1}
        className="draw [animation-delay:600ms]"
      />
      <path
        d="M70 83 C110 83 112 60 150 60"
        pathLength={1}
        className="draw [animation-delay:700ms]"
      />
      <rect
        x="150"
        y="42"
        width="72"
        height="36"
        rx="9"
        pathLength={1}
        className="draw [animation-delay:900ms]"
      />
      <path
        d="M170 60 H202"
        pathLength={1}
        className="draw [animation-delay:1200ms]"
      />
    </svg>
  )
}
