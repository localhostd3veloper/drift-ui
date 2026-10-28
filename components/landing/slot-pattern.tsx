import { useId } from "react"

export function SlotPattern({ className }: { className?: string }) {
  const patternId = useId()

  return (
    <svg aria-hidden className={className}>
      <defs>
        <pattern
          id={patternId}
          width="56"
          height="56"
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="6"
            y="6"
            width="44"
            height="44"
            rx="11"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  )
}
