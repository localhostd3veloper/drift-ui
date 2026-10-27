import { cn } from "@/registry/default/lib/utils"
import { WallTile, type WallTileKind } from "@/components/landing/wall-tile"

type WallDirection = "up" | "down"

const WALL_COPIES = 6

const DIRECTION_ANIMATION: Record<WallDirection, string> = {
  up: "animate-wall-up",
  down: "animate-wall-down",
}

const COLUMNS: {
  kinds: WallTileKind[]
  direction: WallDirection
  durationS: number
}[] = [
  {
    kinds: ["field", "stepper", "badges", "password", "tree"],
    direction: "up",
    durationS: 64,
  },
  {
    kinds: ["tags", "confirm", "date-range", "buttons", "number"],
    direction: "down",
    durationS: 78,
  },
  {
    kinds: ["timeline", "number", "dropzone", "field", "badges"],
    direction: "up",
    durationS: 56,
  },
  {
    kinds: ["buttons", "tree", "tags", "confirm", "stepper"],
    direction: "down",
    durationS: 70,
  },
  {
    kinds: ["password", "dropzone", "badges", "timeline", "date-range"],
    direction: "up",
    durationS: 82,
  },
]

function WallColumn({
  kinds,
  direction,
  durationS,
}: {
  kinds: WallTileKind[]
  direction: WallDirection
  durationS: number
}) {
  return (
    <div
      style={
        {
          animationDuration: `${durationS}s`,
          "--wall-copies": WALL_COPIES,
        } as React.CSSProperties
      }
      className={cn(
        "flex w-72 shrink-0 flex-col will-change-transform motion-reduce:animate-none",
        DIRECTION_ANIMATION[direction]
      )}
    >
      {Array.from({ length: WALL_COPIES }, () => kinds)
        .flat()
        .map((kind, index) => (
          <div key={`${kind}-${index}`} className="pb-6">
            <WallTile kind={kind} />
          </div>
        ))}
    </div>
  )
}

export function ComponentWall({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      inert
      className={cn(
        "pointer-events-none overflow-hidden select-none",
        "[mask-image:radial-gradient(ellipse_55%_75%_at_72%_45%,black_20%,transparent_75%)]",
        className
      )}
    >
      <div className="absolute top-[-30%] left-[46%] flex h-[180%] [transform:perspective(1800px)_rotateX(28deg)_rotateZ(-14deg)_skewX(8deg)] gap-6 opacity-30">
        {COLUMNS.map((column) => (
          <WallColumn
            key={column.kinds.join("-") + column.durationS}
            {...column}
          />
        ))}
      </div>
    </div>
  )
}
