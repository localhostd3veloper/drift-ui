const ANATOMY_PARTS = [
  { label: "card-header", y: 39 },
  { label: "card-content", y: 73 },
  { label: "card-footer", y: 105 },
]

export function AnatomyArt() {
  return (
    <svg viewBox="0 0 260 130" fill="none" className="w-full max-w-72">
      <rect
        x="16"
        y="20"
        width="124"
        height="100"
        rx="10"
        pathLength={1}
        className="draw"
      />
      <rect
        x="30"
        y="34"
        width="70"
        height="10"
        rx="3"
        pathLength={1}
        className="draw [animation-delay:200ms]"
      />
      <rect
        x="30"
        y="56"
        width="96"
        height="34"
        rx="4"
        pathLength={1}
        className="draw [animation-delay:350ms]"
      />
      <rect
        x="30"
        y="100"
        width="46"
        height="10"
        rx="3"
        pathLength={1}
        className="draw [animation-delay:500ms]"
      />
      {ANATOMY_PARTS.map((part, index) => (
        <g key={part.label}>
          <path d={`M128 ${part.y} H168`} strokeDasharray="2 3" />
          <circle
            cx="172"
            cy={part.y}
            r="2.5"
            className="fill-current"
            style={{ opacity: 0.6 + index * 0.2 }}
          />
          <text
            x="180"
            y={part.y + 3}
            className="fill-current stroke-none font-mono text-[9px]"
          >
            {part.label}
          </text>
        </g>
      ))}
    </svg>
  )
}
