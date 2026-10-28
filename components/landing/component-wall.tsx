import { cn } from "@/registry/default/lib/utils"
import { WallTile, type WallTileKind } from "@/components/landing/wall-tile"

const WALL_COPIES = 3

const COLUMNS: WallTileKind[][] = [
  ["field", "stepper", "badges", "password", "tree"],
  ["tags", "confirm", "date-range", "buttons", "number"],
  ["timeline", "number", "dropzone", "field", "badges"],
  ["buttons", "tree", "tags", "confirm", "stepper"],
  ["password", "dropzone", "badges", "timeline", "date-range"],
]

function WallColumn({ kinds }: { kinds: WallTileKind[] }) {
  return (
    <div className="flex w-72 shrink-0 flex-col">
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
        {COLUMNS.map((kinds) => (
          <WallColumn key={kinds.join("-")} kinds={kinds} />
        ))}
      </div>
    </div>
  )
}
